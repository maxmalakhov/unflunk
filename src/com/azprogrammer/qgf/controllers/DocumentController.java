package com.azprogrammer.qgf.controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.azprogrammer.qgf.auth.CredentialMediator;
import com.azprogrammer.qgf.auth.CredentialsHolder;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson.JacksonFactory;
import com.google.api.client.util.Base64;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

@Controller
public class DocumentController {

	protected static final HttpTransport TRANSPORT = new NetHttpTransport();
	protected static final JsonFactory JSON_FACTORY = new JacksonFactory();

	private static final List<String> SUPPORTED_THUMBNAIL_MIME_TYPES = Arrays.asList("image/jpeg", "image/png");
	private static final List<String> SUPPORTED_MIME_TYPES = Arrays.asList("image/jpeg", "image/png", "application/pdf", "video/mp4");
	
	
	@Inject CredentialMediator credentialMediator;
	
	@RequestMapping(value = "/doc")
	public ModelAndView getDocuments() throws IOException {
		Credential credentials = CredentialsHolder.get();
		
		Drive driveService = new Drive.Builder(TRANSPORT, JSON_FACTORY,
				credentials).build();
		
		FileList fileList = driveService.files().list().execute();
		
		List<File> files = new ArrayList<File>();
		for ( File file : fileList.getItems() ) {
			Map<String, String> exportLinks = file.getExportLinks();
			if ( SUPPORTED_MIME_TYPES.contains(file.getMimeType()) ) {
				files.add(file);
			} else if ( exportLinks != null ) {
				String mimeType = getSupportedMimeType(exportLinks.keySet());
				if ( mimeType != null ) {
					file.setMimeType(mimeType);
					files.add(file);
				}
			}
		}

		return new ModelAndView("files", "files", files);
	}
	
	private String getSupportedMimeType(Set<String> mimeTypes) {
		for ( String mimeType : mimeTypes ) {
			if ( SUPPORTED_MIME_TYPES.contains(mimeType) ) {
				return mimeType;
			}
		}
		return null;
	}
	
	private String getSupportedThumbnailMimeType(Set<String> mimeTypes) {
		for ( String mimeType : mimeTypes ) {
			if ( SUPPORTED_THUMBNAIL_MIME_TYPES.contains(mimeType) ) {
				return mimeType;
			}
		}
		return null;
	}
	
	@RequestMapping(value = "/doc/{docId}")
	public void getDocument(@RequestParam(value="mimeType", defaultValue="") String mimeType, @RequestParam(value="thumbnail", defaultValue="false") boolean thumbnail, @RequestParam("userId") String userId, @PathVariable String docId, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		Credential credentials = userId == null ? CredentialsHolder.get() : credentialMediator.getStoredCredential(userId);
		
		Drive driveService = new Drive.Builder(TRANSPORT, JSON_FACTORY,
				credentials).build();

		File file = driveService.files().get(docId).execute();
		Map<String, String> exportLinks = file.getExportLinks();
		
		InputStream content = null;
		if ( thumbnail ) {
			if ( file.getThumbnail() != null && file.getThumbnail().getImage() != null ) {
				byte[] image = Base64.decodeBase64(file.getThumbnail().getImage());
				content = new ByteArrayInputStream(image);
				response.setContentType(file.getThumbnail().getMimeType());
			} else if ( exportLinks != null ) {
				String thumbnailMimeType = getSupportedThumbnailMimeType(exportLinks.keySet());
				if ( thumbnailMimeType != null ) {
					HttpResponse resp = driveService.getRequestFactory()
							.buildGetRequest(new GenericUrl(exportLinks.get(thumbnailMimeType)))
							.execute();
					content = resp.getContent();
					response.setContentType(mimeType);
				}
			}
		} else {
			String downloadUrl = file.getDownloadUrl();
			
			if ( exportLinks != null && exportLinks.containsKey(mimeType) ) {
				downloadUrl = exportLinks.get(mimeType);
			}
			
			HttpResponse resp = driveService.getRequestFactory()
					.buildGetRequest(new GenericUrl(downloadUrl))
					.execute();
			content = resp.getContent();
			response.setContentType(mimeType);
		}

		OutputStream os = response.getOutputStream();
		
		int read = -1;
		byte[] b = new byte[1024];
		while ((read = content.read(b, 0, b.length)) != -1) {
			os.write(b, 0, read);
		}
	}
}
