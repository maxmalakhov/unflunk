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

import com.azprogrammer.qgf.model.WBChannel;
import com.azprogrammer.qgf.model.WBMessage;
import com.azprogrammer.qgf.model.WhiteBoard;
import com.azprogrammer.qgf.model.Workspace;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.repackaged.org.codehaus.jackson.JsonGenerationException;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.dao.DataAccessException;
import org.springframework.orm.jdo.JdoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.Transaction;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;
import java.util.logging.Logger;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 *
 *
 * @author Max Malakhov <malakhovbox@gmail.com>
 * @since 2013-03-05
 */
@Controller
public class WhiteboardController {

    //how long ago does a user have to have pinged before not being in room anymore?
    protected long lastPingMillis = 1000 * 60 * 7;
    static final char[] validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();

    private static Logger LOG = Logger.getLogger("WhiteboardController");

    private static final String URL_WHITEBOARD_ROOT = "/whiteboard";
    private static final String URL_WHITEBOARD_PING = URL_WHITEBOARD_ROOT + "/ping";
    private static final String URL_WHITEBOARD_USERS = URL_WHITEBOARD_ROOT + "/users";

    private UserService userService;

    @Autowired
    protected JdoTemplate persistenceManager;
    //private PersistenceManager persistenceManager;

    private ChannelService channelService;

    public WhiteboardController() {
        userService = UserServiceFactory.getUserService();
        //persistenceManager = PMF.get().getPersistenceManager();
        channelService = ChannelServiceFactory.getChannelService();
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    @RequestMapping(value = URL_WHITEBOARD_PING, method = RequestMethod.POST, consumes = APPLICATION_JSON_VALUE)
    @ResponseBody
    public String ping(@RequestParam String whiteboardId, HttpSession session) {

        String response = null;
        try {
            Map<String, Object> model = new HashMap<String, Object>(1);
            synchronized (this) {
                List<WBChannel> channels = getChannels(whiteboardId, session.getId());
                if((channels != null) && (channels.size () > 0)){
                    WBChannel channel = channels.get(0);
                    channel.setTime(System.currentTimeMillis());
                    persistenceManager.makePersistent(channel);
                    model.put ("status", "ok");
                }else{
                    model.put("error","Invalid channel by whiteboardId "+whiteboardId);
                }
            }
            response = new ObjectMapper().writeValueAsString(model);
        } catch (Exception ex) {
            response = "{ \"error\" : \""+ex.getMessage()+"\" }";
        }
        return response;
    }

    @RequestMapping(value = URL_WHITEBOARD_USERS, method = RequestMethod.POST, consumes = APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getUsers(@RequestParam String whiteboardId, HttpSession session){
        String response = null;
        try {
            Map<String, Object> model = new HashMap<String, Object>(2);
            synchronized (this) {
                List<WBChannel> channels = getLiveChannels(whiteboardId);
                if((channels != null) && (channels.size () > 0)){
                    Set <String> userNames = new HashSet <String> ();
                    for (WBChannel wbChannel : channels) {
                        userNames.add (wbChannel.getUserName ());
                    }
                    model.put("userList", userNames);
                    model.put("status", "ok");
                }else{
                    model.put("error","Invalid channel.");
                }
            }
            response = new ObjectMapper().writeValueAsString(model);
        } catch (Exception ex) {
            response = "{ \"error\" : \""+ex.getMessage()+"\" }";
        }
        return response;
    }

    private List <WBChannel> getChannels(String whiteboardId, String sessionId) {
        List <WBChannel> channels = new ArrayList <WBChannel> ();
        try{
            channels.addAll(persistenceManager.find(
                    WBChannel.class,
                    "this.wbKey == key && this.sessionId == sessId",
                    "com.google.appengine.api.datastore.Key key, String sessId",
                    new Object[] { KeyFactory.stringToKey(whiteboardId), sessionId }));

        } catch(DataAccessException ex) {
            ex.printStackTrace();
        }
        return channels;
    }

    private List <WBChannel> getLiveChannels(String wbId) {
        List <WBChannel> channels = new ArrayList <WBChannel> ();
        try{
            long time = System.currentTimeMillis () - lastPingMillis;

            channels.addAll(persistenceManager.find(
                    WBChannel.class,
                    "this.wbKey == key && this.time > lastPing",
                    "com.google.appengine.api.datastore.Key key, Long lastPing",
                    new Object[] { KeyFactory.stringToKey(wbId), time }));

        } catch(Exception e) {}

        return channels;
    }
}
