/*
 * $Id$
 *
 * Copyright ( c ) 2010 Carefx Corporation. All Rights Reserved.
 *
 * This software is the confidential and proprietary information of Carefx
 * Corporation ("Confidential Information").  You shall not disclose such
 * Confidential Information and shall use it only in accordance with the terms
 * of the license agreement you entered into with Carefx Corporation or a Carefx
 * authorized reseller (the "License Agreement"). Carefx may make changes to the
 * Confidential Information from time to time. Such Confidential Information may
 * contain errors.
 *
 * EXCEPT AS EXPLICITLY SET FORTH IN THE LICENSE AGREEMENT, CAREFX DISCLAIMS ALL
 * WARRANTIES, COVENANTS, REPRESENTATIONS, INDEMNITIES, AND GUARANTEES WITH
 * RESPECT TO SOFTWARE AND DOCUMENTATION, WHETHER EXPRESS OR IMPLIED, WRITTEN OR
 * ORAL, STATUTORY OR OTHERWISE INCLUDING, WITHOUT LIMITATION, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY, TITLE, NON-INFRINGEMENT AND FITNESS FOR A
 * PARTICULAR PURPOSE. CAREFX DOES NOT WARRANT THAT END USER'S USE OF THE
 * SOFTWARE WILL BE UNINTERRUPTED, ERROR FREE OR SECURE.
 *
 * CAREFX SHALL NOT BE LIABLE TO END USER, OR ANY OTHER PERSON, CORPORATION OR
 * ENTITY FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY OR CONSEQUENTIAL
 * DAMAGES, OR DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA OR USE, WHETHER IN AN
 * ACTION IN CONTRACT, TORT OR OTHERWISE, EVEN IF CAREFX HAS BEEN ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGES. CAREFX' TOTAL LIABILITY TO END USER SHALL NOT
 * EXCEED THE AMOUNTS PAID FOR THE CAREFX SOFTWARE BY END USER DURING THE PRIOR
 * TWELVE (12) MONTHS FROM THE DATE IN WHICH THE CLAIM AROSE.  BECAUSE SOME
 * STATES OR JURISDICTIONS DO NOT ALLOW LIMITATION OR EXCLUSION OF CONSEQUENTIAL
 * OR INCIDENTAL DAMAGES, THE ABOVE LIMITATION MAY NOT APPLY TO END USER.
 *
 * Copyright version 2.0
 */
package com.azprogrammer.qgf.controllers;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

import com.azprogrammer.qgf.model.VideoMessage;
import com.azprogrammer.qgf.model.VideoRoom;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Text;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.orm.jdo.JdoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * Serves web requests for operations with Video Sharing over P2P.
 *
 * @author Max Malakhov <malakhovbox@gmail.com>
 * @since 2013-02-21
 */
@Controller
public class VideoChatController {

    private static Logger LOG = Logger.getLogger("VideoChatController");


    private static final String URL_DEMO_PAGE = "/webrtc";

    private static  final String URL_INIT = "/_ah/channel/init";
    private static final String URL_MESSAGE = "/_ah/channel/message";
    private static final String URL_CONNECTED = "/_ah/channel/connected";
    private static final String URL_DISCONNECTED = "/_ah/channel/disconnected";

    private UserService userService;

    @Autowired
    protected JdoTemplate persistenceManager;
    //private PersistenceManager persistenceManager;

    private ChannelService channelService;

    public VideoChatController() {
        userService = UserServiceFactory.getUserService();
        //persistenceManager = PMF.get().getPersistenceManager();
        channelService = ChannelServiceFactory.getChannelService();
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }


    @RequestMapping(value = URL_DEMO_PAGE, method = RequestMethod.GET)
    public ModelAndView showDemoPage(@RequestParam(required = false) String roomKey) {
        return new ModelAndView("webrtc", "roomKey", roomKey);
    }

    @RequestMapping(value = URL_INIT, method = RequestMethod.GET, produces = APPLICATION_JSON_VALUE)
    @ResponseBody
    public String init(@RequestParam(required = false) String otherUser, @RequestParam(required = false) String roomKey,
                     @RequestParam(required = false) String ss, @RequestParam(required = false) String ts,
                     @RequestParam(required = false) String tp, @RequestParam(required = false) String compat,
                     @RequestParam(required = false) String debug, @RequestParam(required = false) String hd,
                     HttpServletRequest request, HttpServletResponse response) {

        String server = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String baseUrl = server + request.getContextPath() + "/webrtc/";

        String user = null;
        int initiator = 0;
        VideoRoom room = null;
        synchronized (this) {
            if ( roomKey != null) {
                room = persistenceManager.getObjectById(VideoRoom.class, KeyFactory.stringToKey(roomKey));
            }
            // New
            if(room == null && !"full".equals(debug)) {
                user = generateName(10);
                room = new VideoRoom();
                if (room.addUser(user)) {
                    persistenceManager.makePersistent(room);
                } else {
                    // TODO: Room is full
                    LOG.warning("Room "+roomKey+" is full");
                }

                if (!"loopback".equals(debug)) {
                    initiator = 0;
                } else {
                    if (room.addUser(user)) {
                        persistenceManager.makePersistent(room);
                        initiator = 1;
                    } else {
                        // TODO: Room is full
                        LOG.warning("Room "+roomKey+" is full");
                    }
                }
            // Free
            } else if (room !=null && room.getOccupancy() == 1 &&  !"full".equals(debug)) {
                user = generateName(10);
                if (room.addUser(user)) {
                    persistenceManager.makePersistent(room);
                    initiator = 1;
                } else {
                    // TODO: Room is full
                    LOG.warning("Room "+roomKey+" is full");
                }
            // Full
            } else {
                // TODO: Room is full
                LOG.warning("Room "+roomKey+" is full");
            }


        }

        roomKey = KeyFactory.keyToString(room.getKey());
        String roomLink = baseUrl + "?roomKey=" + roomKey;
        String token = createChannel(room, user, 30);

        if(compat == null) {
            compat = "TRUE";
        }
        if("loopback".equals(debug)) {
         // set compat to false as DTLS does not work for loopback.
            compat = "FALSE";
        }

        String params = "{\"token\": \""+token+"\""+
                ",\"me\": \""+user+"\""+
                ",\"roomKey\": \""+roomKey+"\""+
                ",\"roomLink\": \""+roomLink+"\""+
                ",\"initiator\": "+initiator+""+  // first user
                ",\"pcConfig\": "+buildPcConfig(ss, ts, tp)+
                ",\"pcConstraints\": "+buildPcConstraints(compat)+
                ",\"offerConstraints\": "+buildOfferConstraints(compat)+
                ",\"mediaConstraints\": "+buildMediaConstraints(hd)+
                ",\"room\": \""+room+"\""+
                "}";


        response.setContentType(APPLICATION_JSON_VALUE);
        return params;
    }

    @RequestMapping(value = URL_MESSAGE, method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void message(@RequestBody String message, @RequestParam String roomKey, @RequestParam String user) {
        StringBuilder log = new StringBuilder();
        synchronized (this) {
            VideoRoom room = null;
            try {
                room = persistenceManager.getObjectById(VideoRoom.class, KeyFactory.stringToKey(roomKey));
            } catch (IllegalArgumentException ex) {
                LOG.warning(ex.getMessage());
            }
            log.append("ROOM by key "+roomKey+" found "+room);
            if (room != null) {
                JSONObject jsonObject = JSONObject.fromObject(message);
                if("bye".equalsIgnoreCase((String) jsonObject.get("type"))) {
                    room.removeUser(user);
                    LOG.info("User " + user + " quit from room " + roomKey);
                    LOG.info("Room " + roomKey + " has state " + room);
                }
                String otherUser = room.getOtherUser(user);
                if(otherUser != null && room.hasUser(otherUser)) {
                    if(otherUser.equals(user)) {
                        message = message.replace("\"offer\"", "\"answer\"");
                        message = message.replace("a=ice-options:google-ice\\r\\n", "");
                    }
                    String clientId = makeClientId(room.getKey(), user);
                    if (room.isConnectedUser(user)) {
                        channelService.sendMessage(new ChannelMessage(clientId, message));
                        LOG.info("Delivered message to user " + user);
                    } else {
                        VideoMessage newMessage = new VideoMessage();
                        newMessage.setClientId(clientId);
                        newMessage.setText(new Text(message));
                        persistenceManager.makePersistent(newMessage);
                        LOG.info("Saved message for user " + user);
                    }
                }
            } else {
                LOG.warning("Unknown room " + roomKey);
            }
        }
        //return log.toString();
    }

    @RequestMapping(value = URL_CONNECTED, method = RequestMethod.POST)
    public void connect(@RequestParam String from) {
        String roomKey = from.split("/")[0];
        String user = from.split("/")[1];
        synchronized (this) {
            VideoRoom room = persistenceManager.getObjectById(VideoRoom.class, KeyFactory.stringToKey(roomKey));
            if (room != null && room.hasUser(user)) {
                room.setUserConnected(user);
                persistenceManager.makePersistent(room);

                sendSavedMessages(room.getKey(), user);

                LOG.info("User " + user + " connected to room " + roomKey);
                LOG.info("Room " + roomKey + " has state " + room);
            } else {
                LOG.warning("Unexpected Connect Message to room " + roomKey);
            }
        }

    }

    @RequestMapping(value = URL_DISCONNECTED, method = RequestMethod.POST)
    public void disconnect(@RequestParam String from) {
        String roomKey = from.split("/")[0];
        String user = from.split("/")[1];
        synchronized (this) {
            VideoRoom room = persistenceManager.getObjectById(VideoRoom.class, KeyFactory.stringToKey(roomKey));
            if (room != null && room.hasUser(user)) {
                // remove user
                deleteSavedMessage(room.getKey(), user);
                room.removeUser(user);
                if(room.getOccupancy() > 0) {
                    persistenceManager.makePersistent(room);
                } else {
                    persistenceManager.deletePersistent(room);
                }
                LOG.info("User " + user + " removed from room " + roomKey);
                LOG.info("Room " + roomKey + " has state " + room);

                // notify other user
                String otherUser = room.getOtherUser(user);
                if(otherUser != null && !otherUser.equals(user)) {
                    channelService.sendMessage(new ChannelMessage(makeClientId(room.getKey(), otherUser), "{\"type\":\"bye\"}" ));
                    LOG.info("Sent BYE to " + otherUser);
                    LOG.warning("User " + user + " disconnected from room " + roomKey);
                }

            }
        }
    }

    private String createChannel(VideoRoom room, String user, int duration) {
        String clientId = makeClientId(room.getKey(), user);
        return ChannelServiceFactory.getChannelService().createChannel(clientId, duration);
    }

    private String generateName(int length) {
        final char[] chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray(); // 62
        final Random randomGenerator = new Random();
        StringBuilder name = new StringBuilder();

        for(int i = 0; i < length; i ++) {
            name.append(chars[randomGenerator.nextInt(chars.length-1)]);
        }

        return name.toString();
        //return UUID.randomUUID().toString();
    }

    private StringBuffer buildMediaConstraints(String hdVideo) {
        StringBuffer constraints = new StringBuffer("{ \"optional\": [], \"mandatory\": {");
        // Demo 16:9 video with media constraints.
        if ("true".equals(hdVideo)) {
            // Demo with WHD by setting size with 1280x720.
            constraints.append("\"minHeight\": \"720\"");
            constraints.append("\"minWidth\": \"1280\"");
            // Disabled for now due to weird stretching behavior on Mac.
            //else:
            // Demo with WVGA by setting Aspect Ration;
            //constraints['mandatory']['maxAspectRatio'] = 1.778
            //constraints['mandatory']['minAspectRatio'] = 1.777
        }
        constraints.append("} }");
        return constraints;
    }

    private StringBuffer buildOfferConstraints(String compat) {
        StringBuffer constraints = new StringBuffer("{ \"mandatory\": {");
        // # For interop with FireFox. Disable Data Channel in createOffer.
        if ("TRUE".equals(compat.toUpperCase())) {
            constraints.append("\"MozDontOfferDataChannel\":\"true\"");
        }
        constraints.append("}, \"optional\": [] }");
        return constraints;
    }

    private StringBuffer buildPcConstraints(String compat) {
        StringBuffer constraints = new StringBuffer("{ \"optional\": [");
        if ("TRUE".equals(compat.toUpperCase())) {
            constraints.append("{\"DtlsSrtpKeyAgreement\": \"true\"}");
        }
        constraints.append("] }");
        return constraints;
    }

    private StringBuffer buildPcConfig(String stunServer, String turnServer, String tsPwd) {
        StringBuffer servers = new StringBuffer("{\"iceServers\":[");
        if (turnServer != null) {
            servers.append("{\"url\": \"turn:"+turnServer+"\", \"credential\":\""+tsPwd+"\"},");
        }

        if (stunServer != null) {
            servers.append("{\"url\": \"stun:"+stunServer+"\"}");
        } else {
            servers.append("{\"url\": \"stun:stun.l.google.com:19302\"}");
        }
        servers.append("] }");

        return servers;

    }

    private void deleteSavedMessage(Key key, String user) {
        String clientId = makeClientId(key, user);
        for(VideoMessage message: findMessageByClientId(clientId)) {
            persistenceManager.deletePersistent(message);
            LOG.info("Deleted the saved message for " + clientId);
        }
    }

    private void sendSavedMessages(Key key, String user) {
        String clientId = makeClientId(key, user);
        for(VideoMessage message: findMessageByClientId(clientId)) {
            channelService.sendMessage(new ChannelMessage(clientId, message.getText().getValue() ));
            LOG.info("Delivered saved message to " + clientId);
            persistenceManager.deletePersistent(message);
        }
    }

    private List<VideoMessage> findMessageByClientId(String clientId) {
        return (List<VideoMessage>) persistenceManager.find(VideoMessage.class, "this.clientId == clientId", "String clientId", clientId);

//        Query query = persistenceManager.newQuery(VideoMessage.class, "this.clientId == clientId");
//        query.declareParameters("String clientId");
//
//        return (List<VideoMessage>) query.execute(clientId);
    }

    private String makeClientId(Key key, String user) {
        return keyToString(key)+"/"+user;

    }

    private String keyToString(Key key) {
        String stringKey;
        if (StringUtils.hasText(key.getName())) {
            stringKey = key.getName();
        } else {
            stringKey = String.valueOf(key.getId());
        }
        return stringKey;
    }

}
