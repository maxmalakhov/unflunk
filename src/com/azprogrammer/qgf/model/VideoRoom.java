package com.azprogrammer.qgf.model;

import com.google.appengine.api.datastore.Key;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * @author Max Malakhov <malakhovbox@gmail.com>
 * @version 0.1
 * @since 2013-02-21
 */
@PersistenceCapable
public class VideoRoom {

    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    protected Key key;

    @Persistent
    private String user1 = null;

    @Persistent
    private String user2 = null;

    @Persistent
    private boolean user1Connected = false;

    @Persistent
    private boolean user2Connected = false;


    public void setUserConnected(String user){
        if(isUser1Equal(user)) {
            setUser1Connected(true);
        } else if (isUser2Equal(user)) {
            setUser1Connected(true);
        }
    }

    public boolean hasUser(String user) {
        if(isUser1Equal(user) || isUser2Equal(user)) {
            return true;
        }
        return false;
    }

    private boolean isUser1Equal(String user) {
        if (getUser1() != null && getUser1().equals(user)) {
            return true;
        }
        return false;
    }

    private boolean isUser2Equal(String user) {
        if (getUser2() != null && getUser2().equals(user)) {
            return true;
        }
        return false;
    }

    // getters and setters

    public Key getKey() {
        return key;
    }

    public void setKey(Key key) {
        this.key = key;
    }

    public String getUser1() {
        return user1;
    }

    public void setUser1(String user1) {
        this.user1 = user1;
    }

    public String getUser2() {
        return user2;
    }

    public void setUser2(String user2) {
        this.user2 = user2;
    }

    public boolean isUser1Connected() {
        return user1Connected;
    }

    public void setUser1Connected(boolean user1Connected) {
        this.user1Connected = user1Connected;
    }

    public boolean isUser2Connected() {
        return user2Connected;
    }

    public void setUser2Connected(boolean user2Connected) {
        this.user2Connected = user2Connected;
    }

}
