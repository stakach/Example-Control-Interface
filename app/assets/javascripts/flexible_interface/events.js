var controller = null,
	On = true,
	Off = false;

$(document).ready(function () {
	//
	// Disable selection (from jquery.ui)
	//
	$('html, body').disableSelection();
	
	
	//
	// --------- Start login javascript ---------
	//
	
	
	//
	// Connection tracking
	//
	var system_id = parseInt($('body').data('system')),
		authing = false;
	
	
	//
	// initialize a new controller object with bindings to special events
	//
	$.modal("<div><h1>Connecting. Please wait..</h1></div>");
	controller = new AutomateEm.EventsDispatcher({
		system: system_id,						// System callback not called if entered here
		auto_auth: true,						// Let's auto authenticate
		idle_update: true						// Update the system when it is not in use
	});
	controller.bind({
		authenticate: function () {	// Called if automatic authentication fails
			if(!authing) {
				authing = true;
				$.modal.close();
				$('#login').modal();	// Ask the user for login details
			}
		},
		ready: function () {
			// Enable the interface
			authing = false;
			$.modal.close();
		},
		close: function () {
			// Disable the interface
			authing = false;
			$.modal.close();
			$.modal('<div><h1>Disconnected.<br />Trying to reconnect.</h1></div>');
		}
	});
	
	
	//
	// Login dialog
	//	username == authsource\user
	//
	$('#login form').submit(function () {
		var $this = $('#login > form > div'),
		username = $this.children('input.user').val().split('\\'),
		password = $this.children('input.password').val(),
		domain = username[0];
		username = username[1];
		
		controller.send("authenticate", username, password, domain);
		$.modal.close();
		$.modal("<div><h1>Authenticating. Please wait..</h1></div>");
		
		return false; // Cancel default action
	});
	
	$('#login input.do-auth-device').click(function () {	// Switch to the trust box
		
		$.modal.close();
		$('#trust').modal();
		
	});
	
	//
	// Trust dialog
	//
	$('#trust img').click(function () {	// Close button switches to the login dialog
		
		$.modal.close();
		$('#login').modal();
		
	});
	
	$('#trust form').submit(function () {	// Trust device form
		
		var reason = $('#trust textarea').val();
		
		jQuery.ajax('/tokens/new', {
			type: 'GET',
			dataType: 'text',
			success: function(data, textStatus, jqXHR){
				//
				// Set the csrf token
				// Get the new one-time-key
				//
				$('meta[name="csrf-token"]').attr('content', data);
				
				jQuery.ajax('/tokens', {
					type: 'POST',
					data: {
						'trusted_device[reason]': reason,
						'system': system_id
					},
					dataType: 'text',
					success: function(data, textStatus, jqXHR){
						window.location.reload();	// Trigger auto login
					},
					error: function(jqXHR, textStatus, errorThrown){
						var errors = {},
							html = $('<div><h1>Unable to build trust:</h1><ul /></div>');
						try {
							errors = jQuery.parseJSON(jqXHR.responseText);
						} catch(e) {}
						$.each(errors, function(key, value) {
							$('<li />').text(key + ': ' + value).appendTo(html.find('ul'));
						});
						$.modal.close();
						$.modal(html);
						setTimeout("$.modal.close();$('#login').modal();", 6000);
					}
				});
			},
			error: function(){
				//
				// This can safely be ignored. Here for debugging
				//
				var damn = "fail";
			}
		});
		
		return false; // Cancel default action
	});
	
	//
	// --------- End login javascript ---------
	//
	
	
	
	//
	// Events we want to listen to
	//
	controller.bind('Interface.page', function (id) {
		location.hash = id;
	});
	
	controller.bind('Interface.display', function (input) {
		$('#display div.selected').removeClass('selected');
		$('#' + input).addClass('selected');
	});
	
	controller.bind('Interface.preview', function (input) {
		$('#preview div.selected').removeClass('selected');
		$('#' + input).addClass('selected');
	});
	
	controller.bind('Interface.audio', function (input) {
		$('#audio div.selected').removeClass('selected');
		$('#' + input).addClass('selected');
	});
	
	controller.bind('Interface.light', function (level) {
		$('#lights div.selected').removeClass('selected');
		$('#' + level).addClass('selected');
	});
	
	controller.bind('Interface.power', function (state) {
		$('#display-status').val(state).slider('refresh');
	});
	
	controller.bind('Interface.screen', function (state) {
		$('#screen-status').val(state).slider('refresh');
	});
	
	controller.bind('Interface.volume_max', function (value) {
		$('#volume').attr('max', value);
	});
	
	controller.bind('Interface.volume_min', function (value) {
		$('#volume').attr('min', value);
	});
	
	controller.bind('Interface.volume', function (value) {
		$('#volume').val(value).slider('refresh');
	});
	


	
	//
	// User interactions we want to take note of
	//
	$('body').bind('pagechange', function (event, data) {
		controller.send('Interface.page', $(data.toPage).attr('id'));
	});
	
	$('#volume-wrapper').change(function () {
		controller.send("Interface.volume", $('#volume').val());
	});
	
	$('#display-status').change(function () {
		controller.send("Interface.power", $(this).val());
	});
	
	$('#screen-status').change(function () {
		controller.send("Interface.screen", $(this).val());
	});
	
	$('#display').delegate('div.section-box', 'tap', function () {
		controller.send("Interface.display", $(this).attr('id'));
	});
	
	$('#preview').delegate('div.section-box', 'tap', function () {
		controller.send("Interface.preview", $(this).attr('id'));
	});
	
	$('#audio').delegate('div.section-box', 'tap', function () {
		controller.send("Interface.audio", $(this).attr('id'));
	});
	
	$('#lights').delegate('div.section-box', 'tap', function () {
		controller.send("Interface.light", $(this).attr('id'));
	});
});