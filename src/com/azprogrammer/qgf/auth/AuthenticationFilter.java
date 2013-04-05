package com.azprogrammer.qgf.auth;

import java.io.IOException;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import com.google.api.client.auth.oauth2.Credential;

@Component("authenticationFilter")
public class AuthenticationFilter extends GenericFilterBean {
	@Inject CredentialMediator credentialMediator;

	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {
		if ( arg0 instanceof HttpServletRequest && arg1 instanceof HttpServletResponse ) {
			HttpServletRequest request = (HttpServletRequest)arg0;
			HttpServletResponse response = (HttpServletResponse)arg1;

			try {
				Credential credential = credentialMediator.getActiveCredential();
				CredentialsHolder.set(credential);
				if ( request.getParameter("state") != null ) {
					response.sendRedirect(request.getParameter("state"));
				}
			} catch (CredentialMediator.NoRefreshTokenException e) {
				try {
					response.sendRedirect(e.getAuthorizationUrl());
					return;
				} catch (IOException ioe) {
					ioe.printStackTrace();
					throw new RuntimeException(
							"Failed to redirect for authorization.");
				}
			} catch (IOException e) {
				String message = String.format(
						"An error happened while reading credentials: %s",
						e.getMessage());
				sendError(response, 500, message);
				throw new RuntimeException(message);
			}
		}
		
		try {
			arg2.doFilter(arg0, arg1);
		} finally {
			CredentialsHolder.set((Credential)null);
		}
	}
	
	/**
	 * Path component under war/ to locate client_secrets.json file.
	 */
	public static final String CLIENT_SECRETS_FILE_PATH = "/WEB-INF/client_secrets.json";
	
	protected void sendError(HttpServletResponse resp, int code, String message) {
		try {
			resp.sendError(code, message);
		} catch (IOException e) {
			throw new RuntimeException(message);
		}
	}

	/*protected String getClientId(HttpServletRequest req,
			HttpServletResponse resp) {
		return getCredentialMediator(req, resp).getClientSecrets().getWeb()
				.getClientId();
	}

	protected void deleteCredential(HttpServletRequest req,
			HttpServletResponse resp) {
		CredentialMediator mediator = getCredentialMediator(req, resp);
		try {
			mediator.deleteActiveCredential();
		} catch (IOException e) {
			String message = String.format(
					"An error happened while reading credentials: %s",
					e.getMessage());
			sendError(resp, 500, message);
			throw new RuntimeException(message);
		}
	}*/
}
