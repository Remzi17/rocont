
import './scripts/init.js';
import './components.js';

//
//
//
//
// Общие скрипты

// Слайдер 
if (document.querySelector('.features-swiper')) {
	let featuresSlider = new Swiper('.features-swiper', {
		// autoplay: {
		// 	delay: 4000,
		// },
		navigation: {
			nextEl: '.features-next',
			prevEl: '.features-prev',
		},
		keyboard: {
			enabled: true,
			onlyInViewport: false,
		},
		spaceBetween: 8,
		speed: 500,
		slidesPerView: 'auto',
		// breakpoints: {
		// 	1: {

		// 	},
		// 	1200: {
		// 		slidesPerView: 4,
		// 	},
		// },
	});
}
