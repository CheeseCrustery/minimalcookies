document.getElementById("btn_submit").addEventListener("click", inputToWhitelist);
document.getElementById('ipt_url').onkeydown = (event) => {
    if (event.keyCode == 13) {
        inputToWhitelist();
    }
}
updateList();

// Update table with whitelisted urls
// Returns void
function updateList() {
	chrome.storage.local.get(["cookieWhitelist"], (items)=>{
		content = "";

		// Hide or show list
		if (Array.isArray(items.cookieWhitelist) && items.cookieWhitelist.length > 0) {
			document.getElementById('div_urllist').style.display = 'flex';

			// Insert data into rows
			items.cookieWhitelist.forEach((item)=>{
				content += "<div class='listelement'>";
				content += item;
				content += "<button class='itembutton' item='" + item + "' \">🞫</button>";
				content += "</div>"
			});
		} else {
			document.getElementById('div_urllist').style.display = 'none';
		}
		
		// Insert content into div
		document.getElementById('div_urllist').innerHTML = content;
		
		// Activate buttons
		var buttons = document.querySelectorAll(".itembutton");
		buttons.forEach((button) => {
			button.onclick = function() { whitelistRemove(this.getAttribute('item')); };
		});
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
	var item = document.getElementById("ipt_url").value.trim();
	item = item.replace(/\s+/g, '');
	document.getElementById("ipt_url").value = null;
	whitelistAdd(item);
}