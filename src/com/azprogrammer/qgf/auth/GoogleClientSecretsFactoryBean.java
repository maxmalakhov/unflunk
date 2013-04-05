package com.azprogrammer.qgf.auth;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import javax.inject.Inject;

import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.azprogrammer.qgf.auth.CredentialMediator.InvalidClientSecretsException;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.json.JsonFactory;

@Component("secrets")
public class GoogleClientSecretsFactoryBean implements FactoryBean<GoogleClientSecrets> {
	@Value("${com.unflunk.google.api.secrets}") private String clientSecrets; 
	@Inject private JsonFactory jsonFactory;
	
	public GoogleClientSecrets getObject() throws Exception {
		try {
			return GoogleClientSecrets.load(
			          jsonFactory, new ByteArrayInputStream(clientSecrets.getBytes()));
		} catch (IOException e) {
		    throw new InvalidClientSecretsException(
		          "client_secrets.json is missing or invalid.");
		}
	}

	public Class<?> getObjectType() {
		return GoogleClientSecrets.class;
	}

	public boolean isSingleton() {
		return true;
	}
}
