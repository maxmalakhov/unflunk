package com.azprogrammer.qgf.auth;

import com.google.api.client.auth.oauth2.Credential;

public class CredentialsHolder {
	static final ThreadLocal<Credential> credential = new ThreadLocal<Credential>();
	static final ThreadLocal<CredentialMediator> credentialMediator = new ThreadLocal<CredentialMediator>();
	
	public static Credential get() {
		return credential.get();
	}
	
	static void set(Credential credential) {
		CredentialsHolder.credential.set(credential);
	}
	
	static void set(CredentialMediator credentialMediator) {
		CredentialsHolder.credentialMediator.set(credentialMediator);
	}
}
