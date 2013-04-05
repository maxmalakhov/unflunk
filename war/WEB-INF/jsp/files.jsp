<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<h3>Your Google Drive Files</h3>
<ul>
	<c:forEach var="file" items="${files}">
		<li data-mime-type="${file.mimeType}" data-url="/doc/${file.id}?userId=${userId}">${file.title}</li>
	</c:forEach>
</ul>