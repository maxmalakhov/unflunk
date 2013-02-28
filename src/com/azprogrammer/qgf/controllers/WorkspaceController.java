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

import com.azprogrammer.qgf.model.*;
import com.azprogrammer.qgf.views.ExternalRedirectView;
import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.orm.jdo.JdoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.*;
import java.util.logging.Logger;

/**
 *
 *
 * @author Max Malakhov <malakhovbox@gmail.com>
 * @since 2013-02-21
 */
@Controller
public class WorkspaceController {

    //how long ago does a user have to have pinged before not being in room anymore?
    protected long lastPingMillis = 1000 * 60 * 7;
    static final char[] validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".toCharArray();

    private static Logger LOG = Logger.getLogger("WorkspaceController");

    private static final String PARAM_TOKEN_WORKSPACE = "token";

    private static final String URL_WORKSPACE_HOME = "/workspace";
    private static final String URL_WORKSPACE_NEW = URL_WORKSPACE_HOME + "/new";
    private static final String URL_WORKSPACE_SPECIFIC = URL_WORKSPACE_HOME + "/{"+ PARAM_TOKEN_WORKSPACE +"}";

    private UserService userService;

    @Autowired
    protected JdoTemplate persistenceManager;
    //private PersistenceManager persistenceManager;

    private ChannelService channelService;

    public WorkspaceController() {
        userService = UserServiceFactory.getUserService();
        //persistenceManager = PMF.get().getPersistenceManager();
        channelService = ChannelServiceFactory.getChannelService();
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    @RequestMapping(value = URL_WORKSPACE_SPECIFIC, method = RequestMethod.GET)
    public ModelAndView showLoginPageRest(@RequestHeader(required = false) String referer,
                                          @RequestHeader("User-Agent") String userAgent,
                                          @PathVariable String token,
                                          HttpSession session) {

        return showLoginPage(referer, userAgent, token, session);
    }

    @RequestMapping(value = URL_WORKSPACE_HOME, method = RequestMethod.GET)
    public ModelAndView showLoginPage(@RequestHeader String referer,
                                      @RequestHeader("User-Agent") String userAgent,
                                      @RequestParam(value = "wb", required = false) String wbId,
                                      HttpSession session) {

        ModelAndView mav = new ModelAndView ();
        WhiteBoard whiteboard = null;
        List<WBMessage> messages = new ArrayList<WBMessage>();

        if((wbId != null) && (!"".equals (wbId.trim()))){
            wbId = cleanupWbId(wbId);
            try {
                Key key = KeyFactory.stringToKey(wbId);
                whiteboard = persistenceManager.getObjectById(WhiteBoard.class, key);

                messages.addAll(persistenceManager.find(
                        WBMessage.class,
                        "this.wbKey == key",
                        "com.google.appengine.api.datastore.Key key",
                        new Object[] { key },
                        "creationTime asc"));
            } catch(Exception e) {
                mav.addObject("errorMsg", e.getMessage());
            }
        } else {
            whiteboard = new WhiteBoard();
            whiteboard.setCreatedBySessionId(session.getId());
            whiteboard.setCreationDate(new Date());
            whiteboard.setReferer(referer);
            whiteboard.setUserAgent(userAgent);
            persistenceManager.makePersistent(whiteboard);

            ExternalRedirectView redirect = new ExternalRedirectView(URL_WORKSPACE_HOME + "/"+KeyFactory.keyToString(whiteboard.getKey()));
            mav.setView (redirect);
            return mav;
        }

        if (whiteboard == null) {
            mav.setViewName("badWbId");
            return mav;
        }

        //don't need key data in JSON
        JsonConfig jsconfig = new JsonConfig();
        String[] exlcudes = new String[] {"key","wbKey","userList","shapeId"};
        jsconfig.setExcludes (exlcudes);
        HashMap<String, Object> messagesMap = new HashMap <String, Object>();
        messagesMap.put("messages", messages);
        mav.addObject("messageMapJSON", JSONObject.fromObject(messagesMap,jsconfig).toString());

        String wbKeyStr = KeyFactory.keyToString(whiteboard.getKey ());

        Object userNameObj = session.getAttribute("userName");
        String userName = null;
        if (userNameObj != null) {
            userName = userNameObj.toString();
            WBChannel channel = null;
            try {
                List<WBChannel> channels = (List<WBChannel>) persistenceManager.find(
                        WBChannel.class,
                        "this.wbKey == key && this.sessionId == sessId",
                        "com.google.appengine.api.datastore.Key key, String sessId",
                        new Object[] { whiteboard.getKey(), session.getId() } );

                if ((channels != null) && (channels.size () > 0)){
                    channel = channels.get(0);
                    channel.setTime(System.currentTimeMillis());
                    persistenceManager.makePersistent(channel);
                }
            } catch(Exception e) {
                mav.addObject("errorMsg", e.getMessage());
            }

            if(channel == null){
                channel = new WBChannel();
                channel.setSessionId(session.getId());
                channel.setWbKey(whiteboard.getKey());
                channel.setUserName(userName);
                channel.setTime(System.currentTimeMillis());
                channel.setUserAgent(userAgent);
                persistenceManager.makePersistent(channel);
            }

            pushNewUserList(wbId);

            mav.addObject("userName", userName);
            mav.addObject("token", channelService.createChannel(session.getId()));
        }

        mav.addObject("wbId", wbKeyStr);
        mav.setViewName("workspace");
        return mav;
    }

    private String cleanupWbId(String wbId) {
        if(wbId != null && (wbId.indexOf ("'") > -1 || wbId.indexOf ("\"") > -1)) {
            return null;
        }
        return wbId;
    }

    private void pushNewUserList(String wbId) {
        List <WBChannel> channels = getLiveChannels(wbId);
        HashSet <String> userNames = new HashSet <String> ();
        for (WBChannel wbChannel : channels) {
            userNames.add (wbChannel.getUserName ());
        }
        ChannelService channelService = ChannelServiceFactory.getChannelService();
        for (WBChannel wbChannel : channels) {
            try  {
                WBMessage message = new WBMessage ();
                message.setUserList (userNames);
                channelService.sendMessage(new ChannelMessage(wbChannel.getSessionId (),JSONObject.fromObject (message).toString () ));

            } catch(Exception e) {}
        }
    }

    protected List <WBChannel> getLiveChannels(String wbId) {
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
