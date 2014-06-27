$(function(){
    if(core){
        core.form = new Form();
    }    
});
    
function Form(){
	
	// Public properties of the form object
	this.validateForm = validateForm;
	
    /******************************
     * 		General Methods
     ******************************/
	
	// Function to validate form
	function validateForm(params, handler){
		
		var error_flag = false;
		var req_group = '';
		var req_group_chk = 0;
		var number_group_check = 0;
		
		// Disable buttons in form
		core.disableButtons(params.form_handle);
		
		// Hide all errors
		$('[association]', params.form_handle).addClass('hidden');
		
		// Check grouped inputs that are required
		params.form_handle.find(':input[req_group]').each(function() {
			
			if ($(this).attr('req_group') != req_group)
			{
				req_group = $(this).attr('req_group');
				req_group_chk = 0;
			}
			
			if($(this).attr('req_group') == req_group){
				if($(this).attr('placeholder') != $(this).val() && $(this).val().trim().length != 0){
					req_group_chk++;
				}
			}
			
			if(req_group_chk > 0){
				$('[association="'+req_group+'"]').addClass('hidden');
			}
			else{
				$('[association="'+req_group+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_required);
				error_flag = true;
			}
			
		});
		
    	// If required/placeholder values error, set error flag
		params.form_handle.find(':input').each(function() {   
			
			// Get type
			var type = this.type || this.tagName.toLowerCase();
			
    		if($(this).attr('required') == "required"){  
    			
    			// Check for grouped inputs and skip them
    			var group_attr = $(this).attr('req_group');

    			if (group_attr === undefined || group_attr == false) {
    				
	    			// Check most type of inputs
	    			if($(this).attr('placeholder') == $(this).val() || $(this).val().trim().length == 0){    				
	    				$('[association="'+$(this).attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_required);
	    				error_flag = true;
	        		}else{
	        			$('[association="'+$(this).attr('name')+'"]').addClass('hidden');
	        		}
	    			
	    			// Check radio boxes
	    			if($('input:radio[name="'+$(this).attr('name')+'"]').length > 0){
	    				if($('input:radio[name="'+$(this).attr('name')+'"]:checked').length == 0){
	    					$('[association="'+$(this).attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_required);
	        				error_flag = true;
	    				}
	    			}
	    			
	    			// Check checkboxes
	    			if($('input:checkbox[name="'+$(this).attr('name')+'"]').length > 0){
	    				if($('input:checkbox[name="'+$(this).attr('name')+'"]:checked').length == 0){
	    					$('[association="'+$(this).attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_required);
	        				error_flag = true;
	    				}
	    			}    		
    			}
    		}
    		
    		// Check for numeric input
    		if($(this).attr('number') == "true"){
    			
    			var re = new RegExp('^[0-9]{1,20}$');
    			var number = $(this).val();
    			var group_attr = $(this).attr('req_group');
    			
    			if(!re.test(number)) {    				
    				if(typeof group_attr == 'undefined' || group_attr == false){
    					$('[association="'+$(this).attr('name')+'"]').text('The value must be numeric.');
    					$('[association="'+$(this).attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_numeric);
    					error_flag = true;
    				}
    				else{
    					req_group = $(this).attr('req_group');
	    				$('[association="'+req_group+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_numeric);
	    				number_group_check++;
	    				error_flag = true;
    				}
    			}
    			else{
    				if(group_attr === undefined || group_attr == false){
    					$('[association="'+$(this).attr('name')+'"]').addClass('hidden');
    				}
    				else{
    					if (number_group_check ==0){
    						$('[association="'+req_group+'"]').addClass('hidden');

    					}
    				}
    			}    		
    		}
    		
    		if(type == "file"){ 
    			
    			var re;
    			
	    		if($(this).attr('filetype') == "doc-image"){
	    			// Test for proper doc/image file name format
	    			re = new RegExp('^.*\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP|JPEG|txt|pdf|doc|docx|csv|xml|xls|xlsx|TXT|PDF|DOC|DOCX|CSV|XML|XLS|XLSX)$'); 
	    		}else if($(this).attr('filetype') == "image"){
	    			// Test for proper image file name format
	    			re = new RegExp('^.*\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP|JPEG)$'); 
	    		}else if($(this).attr('filetype') == "video"){
	    			// Test for proper video file name format   		
		    		re = new RegExp('^.*\.(asf|avi|dv|flv|mov|mp4|mpeg|mpeg4|mpg|mpg4|qt|rm|wmv|ASF|AVI|DV|FLV|MOV|MP4|MPEG|MPEG4|MPG|MPG4|QT|RM|WMV)$');
	    		}
	    		
    			if($(this).is('[multiple]')){
    				
    				var file_input_handle = $(this);
    				var remove_file_index = 1;
    				
    				$.each($(this)[0].files, function(key, value)
					{	   			
		    			var file_name = value.name;		    			
		    			var remove_file_list = file_input_handle.attr('remove_file_list').split(',');		    			 			
		    			
		    			if(core.inArray(remove_file_index, remove_file_list)){
		    				remove_file_index++;
		    				return true;
		    			}
		    			
		    			if(re.test(file_name) || (file_name.length == 0 && file_input_handle.attr('required') != "required")){
		    				$('[association="'+file_input_handle.attr('name')+'"]').addClass('hidden');
		    			}
		    			else{    				
		    				if(file_input_handle.attr('placeholder') == file_input_handle.val() ||file_input_handle.val().length == 0){
		    					if(file_input_handle.attr('required') == "required"){
		    	    				$('[association="'+file_input_handle.attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_required);
		    					}
		    				}
		    				else{
		        				$('[association="'+file_input_handle.attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_file_type);
		    				}
		    				error_flag = true;
		    				return false;
		    			}
		    			remove_file_index++;
					});
	    			
    			}else{
	    			var re = new RegExp('^.*\.(png|jpg|gif|bmp|jpeg|PNG|JPG|GIF|BMP|JPEG|txt|pdf|doc|docx|csv|xml|xls|xlsx|TXT|PDF|DOC|DOCX|CSV|XML|XLS|XLSX)$');    			
	    			var file_name = $(this).val().substring($(this).val().lastIndexOf("\\")+1);
	    			
	    			if(re.test(file_name) || (file_name.length == 0 && $(this).attr('required') != "required")){
	    				$('[association="'+$(this).attr('name')+'"]').addClass('hidden')
	    			}
	    			else{    				
	    				if($(this).attr('placeholder') == $(this).val() || $(this).val().length == 0){
	    					if($(this).attr('required') == "required"){
	    	    				$('[association="'+$(this).attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_field_required);
	    					}
	    				}
	    				else{
	        				$('[association="'+$(this).attr('name')+'"]').removeClass('hidden').html(core.locale.locale_language.locale_error_file_type);
	    				}
	    				error_flag = true;
	    			}
    			}
    		}    	
		});   
		
		// Process form and send it off if override is not set
    	if(!error_flag && params.form_handle.find(':input[name="override"]').length == 0){ 
    		
    		// AJAX submission for file submission
    		if ($('input:file', params.form_handle).length > 0){    			
    			
    			var form_data = new FormData();
    			
    			$.each(params.form_json, function(key, value){
					form_data.append(key, value);
				});
    			
    			var size_error = false;
    			var total_size = 0;
    				
				// Loop for each file
    			$('input:file', params.form_handle).each(function(){
    				
    				if($(this).is('[multiple]')){
        				
        				var file_input_handle = $(this);
        				var remove_file_index = 1;
        				
        				for(var i = 0; i< $(this)[0].files.length; i++){
        					
        					var remove_file_list = file_input_handle.attr('remove_file_list').split(',');
        						   
    		    			if(core.inArray(remove_file_index, remove_file_list)){
    		    				remove_file_index++;
    		    				continue;
    		    			}
    		    			  
        					total_size += $(this)[0].files[i].size;
        					
        					if ($(this)[0].files[i] !== undefined && $(this)[0].files[i].size > 10*1024*1024)
    	    				{
    	    				    alert("File is too big. 10MB and under.");
    	    				    size_error = true;
    	    				}else if($(this)[0].files[i] === undefined){
    	    					
    	    				}else{
    	    					form_data.append($(this).attr('name'), $(this)[0].files[i]);
    	    				}
        					
        					remove_file_index++;
        				}
        				
        				if(total_size > 20*1024*1024){
        					alert("Total upload must be under 20MB.");
        				    size_error = true;
        				}	
    				
	    			}else{
	    				
	    				if ($(this)[0].files[i] !== undefined && $(this)[0].files[i].size > 10*1024*1024)
	    				{
	    				    alert("File is too big. 10MB and under.");
	    				    size_error = true;
	    				}else if($(this)[0].files[i] === undefined){
	    					
	    				}else{
	    					form_data.append($(this).attr('name'), $(this)[0].files[i]);
	    				} 
	    				
	    			}

    			});    				
    		
    			// If file is too large don't submit form
    			if(size_error == true){
    				core.enableButtons(params.form_handle);
    				return false;
    			}
    			
    			// Check return status, show errors if any
    			function status_handler(result_data){    				
    				// Enable buttons in form
    				core.enableButtons(params.form_handle);    
    				
    				// Show/hide elements depending on their corresponding status (general/resource_specific) (success/error)
    				$.each($.extend({}, result_data.success_arr, result_data.error_arr), function( index, value ) {	
    					if(result_data.status == 'success' && index == "general"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-success').removeClass('alert-danger').html(core.locale.locale_language['locale_'+result_data.status+'_'+value]);
						}else if(result_data.status == 'error' && index == "general"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-danger').removeClass('alert-success').html(core.locale.locale_language['locale_'+result_data.status+'_'+value]); 						
						}else if(result_data.status == 'success' && index == "resource_specific"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-success').removeClass('alert-danger').html(core.resource_text_arr[value]);
						}else if(result_data.status == 'error' && index == "resource_specific"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-danger').removeClass('alert-success').html(core.resource_text_arr[value]);							
						}else{
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').html(core.locale.locale_language['locale_'+result_data.status+'_'+value]);
						}
					});
    				
    				// if success, hide form elements, and call callback, hide submit button, change 'cancel' to 'close'
    				if(result_data.status == 'success'){
    					$('[data-dismiss="modal"]:not(.close)', params.form_handle).html(core.locale.locale_language.locale_close);
    					$('[type="submit"]:not([skip_hide])', params.form_handle).addClass('hidden');
    					$('.form-group:not([skip_hide])', params.form_handle).addClass('hidden');
    					handler(result_data.data_arr);    					    					
    				}else{
    					core.navigation.jumpToError();
    				}    				
            	}
    			
    			return core.ajax_file_upload(params.href, form_data, params.request, status_handler);
    			
    		}
    		else{
    			// Check return status, show errors if any
    			function status_handler(result_data){    				
    				// Enable buttons in form
    				core.enableButtons(params.form_handle);    
    				
    				// Show/hide elements depending on their corresponding status (general/resource_specific) (success/error)
    				$.each($.extend({}, result_data.success_arr, result_data.error_arr), function( index, value ) {	
    					if(result_data.status == 'success' && index == "general"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-success').removeClass('alert-danger').html(core.locale.locale_language['locale_'+result_data.status+'_'+value]);
						}else if(result_data.status == 'error' && index == "general"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-danger').removeClass('alert-success').html(core.locale.locale_language['locale_'+result_data.status+'_'+value]); 						
						}else if(result_data.status == 'success' && index == "resource_specific"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-success').removeClass('alert-danger').html(core.resource_text_arr[value]);
						}else if(result_data.status == 'error' && index == "resource_specific"){
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').addClass('alert-danger').removeClass('alert-success').html(core.resource_text_arr[value]);							
						}else{
							$('[association="'+index+'"]', params.form_handle).removeClass('hidden').html(core.locale.locale_language['locale_'+result_data.status+'_'+value]);
						}
					});
    				
    				// if success, hide form elements, and call callback, hide submit button, change 'cancel' to 'close'
    				if(result_data.status == 'success'){
    					$('[data-dismiss="modal"]:not(.close)', params.form_handle).html(core.locale.locale_language.locale_close);
    					$('[type="submit"]:not([skip_hide])', params.form_handle).addClass('hidden');
    					$('.form-group:not([skip_hide])', params.form_handle).addClass('hidden');
    					handler(result_data.data_arr);    					    					
    				}else{
    					core.navigation.jumpToError();
    				}    				
            	}
    			
    			return core.ajax(params.href, params.form_json, params.request, status_handler);
    		}
		}else if(!error_flag && params.form_handle.find(':input[name="override"]').length > 0){	
			// Enable buttons in form
			core.enableButtons(params.form_handle);		
			handler(null);
		}else{
			// Enable buttons in form
			core.enableButtons(params.form_handle);			
			core.navigation.jumpToError();
		}
	
	} 	
	
    // Convert all form inputs to a JSON object
    $.fn.serializeJSON=function(){
    	var json = {};
		$.map($(this).serializeArray(), function(n, i){
			json[n['name']] = n['value'];
		});
		return json;
    };
    
    /******************************
     * 		Event Handlers
     ******************************/
    
    // Action for clicking a modal form button
    $(document).on('submit', 'form', function(event) {

    	var href = $(this).attr('href');
    	var callback = $(this).attr('callback');
    	var request = $(this).attr('request');
    	var action = $(this).attr('action');
    	var form_handle = $(this);
    		
    	// Grab serialized format of all inputs in 
		var form_json = form_handle.find(':input').serializeJSON();
		form_json.action = action;
		
		var params = {
			href: href,
	        action: action,
	        request:request,
	        form_handle: form_handle,
	        form_json: form_json
	    };

    	function handler(result_data){ 
    		// Evaluate the callback if it is set
    		if (callback != "" && callback != ""){
        		// If there is a file return the file object
        		if(result_data != null){
        			eval(callback + "(form_json, result_data);");
        		}
        		else{        			
        			eval(callback + "(form_json);");
        		}        	
    		}
    	}   
    	
    	core.form.validateForm(params, handler);    
    	
    	event.preventDefault();
		event.stopPropagation();
		
		return false;    
    });

}