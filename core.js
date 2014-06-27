/*
* Core Global Class
*
* FUTURE WARNING: all instances assigned under the Core global namespace, should be initialized only on DOM Ready, and be included after this script.
*/

// Create a global variable for the Core object
var core;

// After DOM ready
$(function() {
	
	core = new Core();
	
});

function Core() {
	// Public properties of the Core object
	this.ajax = ajax;
	this.ajax_file_upload = ajax_file_upload;
	this.ajaxErrorHandler = ajaxErrorHandler;
	this.getCookie = getCookie;
	this.createCookie = createCookie;
	this.deleteCookie = deleteCookie;
	this.loadModal = loadModal;
	this.closeModal = closeModal;
	this.enableButtons = enableButtons;
	this.disableButtons = disableButtons;
	this.commafyNumber = commafyNumber;
	this.decommafyNumber = decommafyNumber;
	this.flourishElement = flourishElement;
	this.attachLoader = attachLoader;
	this.detachLoader = detachLoader;
	this.inArray=inArray;

	// Holds all return data
	this.href = '';
	this.uri_arr = {};
	this.title = '';
	this.user = {};
	this.locale = {};
	this.language_arr = {};
	this.country_arr = {};
	this.resource = '';
	this.resource_arr = {};
	this.resource_text_arr = {};	
	
	// POST, PUT, GET, DELETE
	function ajax(href, params, type, handler) {		

		// IE caching preventer
    	if(params == null){
    		params = {'__':(new Date()).getTime() };
    	}else{
    		params['__'] = (new Date()).getTime();
    	}    	
		
		return $.ajax({
			url : href,
			type : type,
			dataType : 'json',
			data : params,
			headers : {
				"cache-control" : "no-cache"
			},
			success : function(result_data) {				
				core.data_obj = result_data;
				handler(result_data);				
			},
			error : ajaxErrorHandler
		});
	}
	
	// POST, PUT, GET, DELETE with File Uploads
	function ajax_file_upload(href, params, type, handler) {		

		// IE caching preventer
    	if(params == null){
    		params = {'__':(new Date()).getTime() };
    	}else{
    		params['__'] = (new Date()).getTime();
    	}    	
		
		return $.ajax({
			url : href,
			type : type,
			dataType : 'json',
			data : params,
	        processData: false,
	        contentType: false,
			headers : {
				"cache-control" : "no-cache"
			},
			success : function(result_data) {				
				core.data_obj = result_data;
				handler(result_data);				
			},
			error : ajaxErrorHandler
		});
	}
	
	function ajaxErrorHandler(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR);
		console.log(textStatus);
		console.log(errorThrown);
		if (jqXHR.status == 401) {
			//window.location.href = '/auth/?action=log_in&redirect_href=' + encodeURIComponent(window.location.href);
		}else{
			//window.location.href = window.location.origin;
		}
	}

	// Create a cookie for the user's cache
	function createCookie(name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} else
			expires = "";
		document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
	}

	// Get a cookie from the user's cache
	function getCookie(name) {
		var name_escaped = escape(name) + "=";
		var cookie_array = document.cookie.split(';');
		for (var i = 0; i < cookie_array.length; i++) {
			var cookie_row = cookie_array[i];
			while (cookie_row.charAt(0) === ' ')
			cookie_row = cookie_row.substring(1, cookie_row.length);
			if (cookie_row.indexOf(name_escaped) === 0)
				return unescape(cookie_row.substring(name_escaped.length, cookie_row.length));
		}
		return null;
	}

	// Delete a cookie from the user's cache
	function deleteCookie(name) {
		createCookie(name, "", -1);
	}
	
	// Inject HTML via Handlebars into Modal
	function loadModal(modal_obj) {
		var template = Templates.core_modals;
		$('#core_modal').html(template({
			request : modal_obj.request,
			location : modal_obj.location,
			action : modal_obj.action,
			callback : modal_obj.callback,
			modal_name : modal_obj.modal_name,
			data_obj : modal_obj.data_obj
		}));
		if(modal_obj.width !== null){
			$('.modal-dialog').css('max-width', modal_obj.width);
			$('.modal-dialog').css('width', 'auto');
		}
		$('#core_modal').modal();
	}
	
	// Show a loading screen
	function attachLoader(type) {
		
		if(type !== undefined && type == "modal_overlay"){
			$('body').addClass("loading");
			$('#core_loading').addClass('loading-modal-overlay');
		}else{
			$('#core_modal').modal().html('');
			$('body').addClass("loading");
		}
	}	
	
	// Remove the loading screen
	function detachLoader(type) {
		$('body').removeClass("loading");
		$('#core_loading').removeClass('loading-modal-overlay');
	}

	// Closes a Modal
	function closeModal() {
		$('#core_modal').modal('hide');
	}	
	
	// Enable buttons
	function enableButtons(handle) {
		$("button:not([skip_disable])", handle).removeAttr("disabled");
	}

	// Disable buttons
	function disableButtons(handle) {
		$("button:not([skip_disable])", handle).attr("disabled", "disabled");
	}
	
	// Set a timeout for an alert box (or something else)
	function flourishElement(handle, seconds){
		handle.removeClass('hidden').show();
		setTimeout(function(){ 
				handle.slideUp(); 
        	}, 
        	seconds*1000
        );
	}	

	// Remove commas from string
	function decommafyNumber(raw_string) {
		return raw_string.replace(/[^\d\.\-\ ]/g, '');
	}

	// Add commas to number
	function commafyNumber(raw_string) {
		while (/(\d+)(\d{3})/.test(raw_string.toString())) {
			commafied_string = raw_string.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
		}
		return commafied_string;
	}
	
	// Check if value is in array
	function inArray(needle,haystack)
	{
	    var count=haystack.length;
	    for(var i=0;i<count;i++)
	    {
	        if(haystack[i]==needle){return true;}
	    }
	    return false;
	}	
	
	// Serialize an object so it can be used as a URI string
	serialize = function(obj) {
		var str = [];
		for(var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
		return str.join("&");
	}

}
