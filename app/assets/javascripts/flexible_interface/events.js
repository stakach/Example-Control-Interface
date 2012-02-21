var controller = null;

$(function () {
	/*controller = new EventsDispatcher("ws://129.78.188.113:81/", "room_123");


	//
	// Events we want to listen to
	//
	controller.bind('lcd.power', function (data) {
		if (data)
			$('#projector1-status').val('on');
		else {
			$('#projector1-status').val('off');
			$('div.selected').removeClass('selected');
		}
	});
	controller.bind('lcd.input', function (data) {
		$('#lights div.selected').removeClass('selected');
		$('#' + data).addClass('selected');
	});
	controller.bind('lcd.audio', function (data) {
		$('#audio div.selected').removeClass('selected');
		$('#' + data).addClass('selected');
	});
	controller.bind('lcd.mute', function (data) {
		// TODO:: interface
	});
	controller.bind('lcd.volume', function (data) {
		var vol = $('#volume-wrapper input');
		if (vol.val() != data)
			$('#volume-wrapper input').val(data);
	});
	controller.bind('lcd.volume_min', function (data) {
		$('#volume-wrapper input').attr('min', data);
	});
	controller.bind('lcd.volume_max', function (data) {
		$('#volume-wrapper input').attr('max', data);
	});
	controller.bind('lcd.lamp_warming', function (data) {
		// TODO:: LCD warming code here
	});*/


	//
	// Change source selection highlight
	//
	$('body').delegate('div.section-box', 'tap', function () {
		var $this = $(this);
		
		$this.parent().parent().find('div.selected').removeClass('selected');
		$this.addClass('selected');

		/*controller.send("display.power", 'on');					// Turn on the display if off
		controller.send("lcd.switch_to", $(this).attr('id'));*/
	});
	
	$('#volume-wrapper input').change(function () {
		controller.send("lcd.volume", $(this).val());
	});
	
	$('#projector1-status').change(function () {
		controller.send("lcd.power", $(this).val());
	});
	
	$('#shutdown').bind('tap',function () {
		controller.send("lcd.power", 'off');
	});
});