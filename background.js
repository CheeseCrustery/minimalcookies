// When browser starts, remove unwanted cookies
chrome.runtime.onStartup.addListener(()=>{

	// Get whitelist
	chrome.storage.local.get(["cookieWhitelist"], (items)=>{
		let whitelist = items.cookieWhitelist;

		// Get cookies
		chrome.cookies.getAll({}, (cookies)=>{

			// Remove cookies
			cookies.forEach((cookie)=>{
				if (!whitelist.includes(cookie.domain)) {
					let url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
					chrome.cookies.remove({"url":url,"name":cookie.name});
				}
			})
		})
	});
})