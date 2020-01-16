// When browser starts, remove unwanted cookies
chrome.runtime.onStartup.addListener(()=>{
	console.log('STARTUP');

	// Get whitelist
	chrome.storage.local.get(["cookieWhitelist"], (items)=>{
		let whitelist = items.cookieWhitelist;
		console.log('WHITELIST:');
		console.log(whitelist);

		// Get cookies
		chrome.cookies.getAll({}, (cookies)=>{
			console.log('COOKIES:');
			console.log(cookies);

			// Remove cookies
			cookies.forEach((cookie)=>{
				if (!whitelist.includes(cookie.domain)) {
					let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
					chrome.cookies.remove({"url":url,"name":cookie.name});
					console.log('Removed:', cookie.domain, cookie.name);
				}
			})
		})
	});
})