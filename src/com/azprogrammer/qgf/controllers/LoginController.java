package com.azprogrammer.qgf.controllers;

import com.azprogrammer.qgf.model.Workspace;
import com.azprogrammer.qgf.util.WebUtil;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.StringTrimmerEditor;
import org.springframework.http.HttpStatus;
import org.springframework.orm.jdo.JdoTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * @author Max Malakhov <malakhovbox@gmail.com>
 * @version 0.1
 * @since 2013-06-21
 */
@Controller
public class LoginController {

    private static final String URL_WORKSPACE_ROOT = "/workspace";
    private static final String URL_WORKSPACE_LOGIN = URL_WORKSPACE_ROOT + "/login";
    private static final String URL_WORKSPACE_LOGOUT = URL_WORKSPACE_ROOT + "/logout";

    @Autowired
    protected JdoTemplate persistenceManager;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(String.class, new StringTrimmerEditor(true));
    }

    @RequestMapping(value = { "/", URL_WORKSPACE_LOGIN }, method = RequestMethod.GET)
    public ModelAndView login(@RequestHeader(required = false) String referer,
                        @RequestHeader("User-Agent") String userAgent,
                        HttpSession session) {

        ModelAndView mav = new ModelAndView();
        if(WebUtil.isMobile(userAgent)){
            mav.addObject("mobileTheme", WebUtil.getMobileTheme(userAgent));
            mav.setViewName("mobile/login");
        }else{
            mav.setViewName("regular/login");
        }
        return mav;
    }

    @RequestMapping(value = URL_WORKSPACE_LOGOUT, method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void logout(HttpSession session) {

        session.removeAttribute("userName");
    }

    @RequestMapping(value = URL_WORKSPACE_LOGIN, method = RequestMethod.POST, consumes = APPLICATION_JSON_VALUE)
    @ResponseBody
    public String login(@RequestHeader(required = false) String referer,
                        @RequestHeader("User-Agent") String userAgent,
                        @RequestParam String userName,
                        HttpSession session) throws IOException {

        Map<String, Object> model = new HashMap<String, Object>(1);

        String workspaceId = null;
        synchronized (this) {
            try {
                List<Workspace> workspaces = (List<Workspace>) persistenceManager.find(
                        Workspace.class,
                        "this.user == userName",
                        "String userName",
                        new Object[] { userName },
                        "creationDate desc");

                if(workspaces.isEmpty()) {
                    Workspace newWorkspace = new Workspace(userName);
                    persistenceManager.makePersistent(newWorkspace);
                    workspaceId = newWorkspace.getStringKey();
                } else {
                    workspaceId = workspaces.get(0).getStringKey();
                }
                session.setAttribute("userName", userName);
            } catch(Exception ex) {
                model.put("error", ex.getMessage());
            }
        }

        if(workspaceId != null) {
            model.put("workspaceId", workspaceId);
        }

        ObjectMapper mapper = new ObjectMapper();
        String response = mapper.writeValueAsString(model);

        return response;
    }

    @RequestMapping(value = { "/test/" }, method = RequestMethod.GET)
    public ModelAndView test(@RequestHeader("User-Agent") String userAgent) {

        ModelAndView mav = new ModelAndView();
        if(WebUtil.isMobile(userAgent)){
            mav.addObject("mobileTheme", WebUtil.getMobileTheme(userAgent));
            mav.setViewName("mobile/test");
        }else{
            mav.setViewName("regular/test");
        }
        return mav;
    }
}
