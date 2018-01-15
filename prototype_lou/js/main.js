jQuery(document).ready(function($){
	//update these values if you change these breakpoints in the style.css file (or _layout.scss if you use SASS)
	var MqM= 768,
		MqL = 1024;

	var faqsSections = $('.cd-faq-group'),
		faqTrigger = $('.cd-faq-trigger'),
		faqsContainer = $('.cd-faq-items'),
		faqsCategoriesContainer = $('.cd-faq-categories'),
		faqsCategories = faqsCategoriesContainer.find('a'),
		closeFaqsContainer = $('.cd-close-panel');
	
	//select a faq section 
	faqsCategories.on('click', function(event){
		event.preventDefault();
		var selectedHref = $(this).attr('href'),
			target= $(selectedHref);
		if( $(window).width() < MqM) {
			faqsContainer.scrollTop(0).addClass('slide-in').children('ul').removeClass('selected').end().children(selectedHref).addClass('selected');
			closeFaqsContainer.addClass('move-left');
			$('body').addClass('cd-overlay');
		} else {
	        $('body,html').animate({ 'scrollTop': target.offset().top - 19}, 200); 
		}
	});

	//close faq lateral panel - mobile only
	$('body').bind('click touchstart', function(event){
		if( $(event.target).is('body.cd-overlay') || $(event.target).is('.cd-close-panel')) { 
			closePanel(event);
		}
	});
	faqsContainer.on('swiperight', function(event){
		closePanel(event);
	});

	//show faq content clicking on faqTrigger
	faqTrigger.on('click', function(event){
		event.preventDefault();
		$(this).next('.cd-faq-content').slideToggle(200).end().parent('li').toggleClass('content-visible');
	});

	//update category sidebar while scrolling
	$(window).on('scroll', function(){
		if ( $(window).width() > MqL ) {
			(!window.requestAnimationFrame) ? updateCategory() : window.requestAnimationFrame(updateCategory); 
		}
	});

	$(window).on('resize', function(){
		if($(window).width() <= MqL) {
			faqsCategoriesContainer.removeClass('is-fixed').css({
				'-moz-transform': 'translateY(0)',
			    '-webkit-transform': 'translateY(0)',
				'-ms-transform': 'translateY(0)',
				'-o-transform': 'translateY(0)',
				'transform': 'translateY(0)',
			});
		}	
		if( faqsCategoriesContainer.hasClass('is-fixed') ) {
			faqsCategoriesContainer.css({
				'left': faqsContainer.offset().left,
			});
		}
	});

	function closePanel(e) {
		e.preventDefault();
		faqsContainer.removeClass('slide-in').find('li').show();
		closeFaqsContainer.removeClass('move-left');
		$('body').removeClass('cd-overlay');
	}

	function updateCategory(){
		updateCategoryPosition();
		updateSelectedCategory();
	}

	function updateCategoryPosition() {
		var top = $('.cd-faq').offset().top,
			height = jQuery('.cd-faq').height() - jQuery('.cd-faq-categories').height(),
			margin = 20;
		if( top - margin <= $(window).scrollTop() && top - margin + height > $(window).scrollTop() ) {
			var leftValue = faqsCategoriesContainer.offset().left,
				widthValue = faqsCategoriesContainer.width();
			faqsCategoriesContainer.addClass('is-fixed').css({
				'left': leftValue,
				'top': margin,
				'-moz-transform': 'translateZ(0)',
			    '-webkit-transform': 'translateZ(0)',
				'-ms-transform': 'translateZ(0)',
				'-o-transform': 'translateZ(0)',
				'transform': 'translateZ(0)',
			});
		} else if( top - margin + height <= $(window).scrollTop()) {
			var delta = top - margin + height - $(window).scrollTop();
			faqsCategoriesContainer.css({
				'-moz-transform': 'translateZ(0) translateY('+delta+'px)',
			    '-webkit-transform': 'translateZ(0) translateY('+delta+'px)',
				'-ms-transform': 'translateZ(0) translateY('+delta+'px)',
				'-o-transform': 'translateZ(0) translateY('+delta+'px)',
				'transform': 'translateZ(0) translateY('+delta+'px)',
			});
		} else { 
			faqsCategoriesContainer.removeClass('is-fixed').css({
				'left': 0,
				'top': 0,
			});
		}
	}

	function updateSelectedCategory() {
		faqsSections.each(function(){
			var actual = $(this),
				margin = parseInt($('.cd-faq-title').eq(1).css('marginTop').replace('px', '')),
				activeCategory = $('.cd-faq-categories a[href="#'+actual.attr('id')+'"]'),
				topSection = (activeCategory.parent('li').is(':first-child')) ? 0 : Math.round(actual.offset().top);
			
			if ( ( topSection - 20 <= $(window).scrollTop() ) && ( Math.round(actual.offset().top) + actual.height() + margin - 20 > $(window).scrollTop() ) ) {
				activeCategory.addClass('selected');
			}else {
				activeCategory.removeClass('selected');
			}
		});
	}


   

});


// bouncy-content-filter effect
jQuery(document).ready(function($){

	//wrap each one of your filter in a .cd-gallery-container
	bouncy_filter($('.cd-gallery-container'));

	function bouncy_filter($container) {
		$container.each(function(){
			var $this = $(this);
			var filter_list_container = $this.children('.cd-filter'),
				filter_values = filter_list_container.find('li:not(.placeholder) a'),
				filter_list_placeholder = filter_list_container.find('.placeholder a'),
				filter_list_placeholder_text = filter_list_placeholder.text(), 
				filter_list_placeholder_default_value = 'Select',
				gallery_item_wrapper = $this.children('.cd-gallery').find('.cd-item-wrapper');

			//store gallery items
			var gallery_elements = {};
			filter_values.each(function(){
				var filter_type = $(this).data('type');
				gallery_elements[filter_type] = gallery_item_wrapper.find('li[data-type="'+filter_type+'"]');
			});

			var project_elements = {};
			filter_values.each(function(){
				var filter_type = $(this).data('type');
				project_elements[filter_type] = gallery_item_wrapper.find('h4[data-type="'+filter_type+'"]');
			});

			//detect click event
			filter_list_container.on('click', function(event){
				event.preventDefault();
				//detect which filter item was selected
				var selected_filter = $(event.target).data('type');
					
				//check if user has clicked the placeholder item (for mobile version)
				if( $(event.target).is(filter_list_placeholder) || $(event.target).is(filter_list_container) ) {

					(filter_list_placeholder_default_value == filter_list_placeholder.text()) ? filter_list_placeholder.text(filter_list_placeholder_text) : filter_list_placeholder.text(filter_list_placeholder_default_value) ;
					filter_list_container.toggleClass('is-open');

				//check if user has clicked a filter already selected 
				} else if( filter_list_placeholder.data('type') == selected_filter ) {
					
					filter_list_placeholder.text($(event.target).text()) ;
					filter_list_container.removeClass('is-open');	

				} else {
					//close the dropdown (mobile version) and change placeholder text/data-type value
					filter_list_container.removeClass('is-open');
					filter_list_placeholder.text($(event.target).text()).data('type', selected_filter);
					filter_list_placeholder_text = $(event.target).text();
					
					//add class selected to the selected filter item
					filter_values.removeClass('selected');
					$(event.target).addClass('selected');

					//give higher z-index to the gallery items selected by the filter
					show_selected_items(gallery_elements[selected_filter]);
                    show_selected_items(project_elements[selected_filter]);

					//rotate each item-wrapper of the gallery
					//at the end of the animation hide the not-selected items in the gallery amd rotate back the item-wrappers
					
					// fallback added for IE9
					var is_explorer_9 = navigator.userAgent.indexOf('MSIE 9') > -1;
					
					if( is_explorer_9 ) {
						hide_not_selected_items(gallery_elements, selected_filter);
						hide_not_selected_items(project_elements, selected_filter);
						gallery_item_wrapper.removeClass('is-switched');
					} else {
						gallery_item_wrapper.addClass('is-switched').eq(0).one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function() {		
							hide_not_selected_items(gallery_elements, selected_filter);
							hide_not_selected_items(project_elements, selected_filter);
							gallery_item_wrapper.removeClass('is-switched');
						});
					}
				}
			});
		});
	} 



});

function show_selected_items(selected_elements) {
	selected_elements.addClass('is-selected');
}

function hide_not_selected_items(gallery_containers, filter) {
	$.each(gallery_containers, function(key, value){
  		if ( key != filter ) {	
			$(this).removeClass('is-visible is-selected').addClass('is-hidden');

		} else {
			$(this).addClass('is-visible').removeClass('is-hidden is-selected');
		}
	});
}

