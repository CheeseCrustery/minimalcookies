document.getElementById("btn_submit").addEventListener("click", inputToWhitelist);
updateList();

// Update table with whitelisted urls
// Returns void
function updateList() {
	chrome.storage.local.get(["cookieWhitelist"], (items)=>{
		content = "";

		// Hide or show list
		if (!Array.isArray(items.cookieWhitelist)) {
			document.getElementById('div_urllist').style.display = 'none';
		} else if (items.cookieWhitelist.length > 0) {
			document.getElementById('div_urllist').style.display = 'flex';

			// Insert data into rows
			items.cookieWhitelist.forEach((item)=>{
				content += "<div class='listelement'>";
				content += item;
				content += "<button class='itembutton' item='" + item + "' \">🞫</button>";
				content += "</div>"
			});
		}
		
		// Insert content into div
		document.getElementById('div_urllist').innerHTML = content;
		
		// Activate buttons
			document.getElementsByClassName('itembutton').forEach((button) => {
				button.addEventListener("click", whitelistRemove(button.item))
			})
	});
}

// Remove item from whitelist
// Returns void
function whitelistRemove(item) {

	// Get old items
	chrome.storage.local.get(["cookieWhitelist"], (items)=>{

		// Modify items
		var newItems = items.cookieWhitelist;
		if (Array.isArray(newItems) && newItems.includes(item)) {
			var index = newItems.indexOf(item);
			if (index > -1) {
				newItems.splice(index, 1);
			}
		}

		// Set new items
		chrome.storage.local.set({"cookieWhitelist":newItems}, ()=>{
			updateList();
		});
	});
}

// Add new item to whitelist if not already existent
// Returns void
function whitelistAdd(item) {
	if (!item) { return; }

	chrome.storage.local.get(["cookieWhitelist"], (items)=>{
		// Check if array exists yet
		var newItems;
		if (Array.isArray(items.cookieWhitelist)) {
			// Check if item exists yet
			if (items.cookieWhitelist.includes(item)) {
				return;
			} else {
				newItems = items.cookieWhitelist;
				newItems.unshift(item);
			}
		} else {
			newItems = [item];
		}

		// Set new items
		chrome.storage.local.set({"cookieWhitelist":newItems}, ()=>{
			updateList();
		});
	});
}

// Get item from input and send to whitelist
// Returns void
function inputToWhitelist() {
	var item = document.getElementById("ipt_url").value;
	document.getElementById("ipt_url").value = null;
	whitelistAdd(item);
}