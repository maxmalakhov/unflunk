package com.azprogrammer.qgf.auth;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

@Component("scopes")
public class Scopes extends ArrayList<String> {
	private static final long serialVersionUID = 1L;
	
	private static final List<String> scopes = Arrays.asList(
		"https://www.googleapis.com/auth/drive",
		"https://www.googleapis.com/auth/userinfo.email",
		"https://www.googleapis.com/auth/userinfo.profile");

	public Scopes() {
		super(scopes);
	}
}
