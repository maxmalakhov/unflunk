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

import com.azprogrammer.qgf.model.PMF;
import com.azprogrammer.qgf.model.VideoRoom;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.jdo.PersistenceManager;
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

    private static final String URL_CONNECTED = "/_ah/channel/connected/";
    private static final String URL_DISCONNECTED = "/_ah/channel/disconnected/";

    private UserService userService;
    private PersistenceManager persistenceManager;

    public VideoChatController() {
        userService = UserServiceFactory.getUserService();
        persistenceManager = PMF.get().getPersistenceManager();
    }


    @RequestMapping(value = URL_CONNECTED, method = RequestMethod.POST)
    public void connect(@RequestParam String from) {
        String roomKey = from.split("/")[0];
        String user = from.split("/")[1];
        synchronized (this) {
            VideoRoom room = persistenceManager.getObjectById(VideoRoom.class, roomKey);
            if (room != null && room.hasUser(user)) {
                room.setUserConnected(user);
                persistenceManager.makePersistent(room);

                String clintId = makeClientId(room.getKey(), user);
                // send saved message
                // TODO:


                LOG.info("User " + user + " connected to room " + roomKey);
                LOG.info("Room " + roomKey + " has state " + room);
            } else {
                LOG.warning("Unexpected Connect Message to room " + roomKey);
            }
        }

    }

    @RequestMapping(value = URL_DISCONNECTED, method = RequestMethod.POST)
    public void disconnect() {
        // TODO:
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
