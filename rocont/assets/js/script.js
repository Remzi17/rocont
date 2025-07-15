(function () {
	'use strict';

	// 
	// 
	// 
	// 
	// Переменные 
	const body = document.querySelector('body');
	const html = document.querySelector('html');
	const popup = document.querySelectorAll('.popup');

	const headerTop = document.querySelector('.header') ? document.querySelector('.header') : document.querySelector('head');
	let fixedElements = document.querySelectorAll('[data-fixed]');
	let stickyObservers = new Map();

	const menuClass = '.header-nav';
	const menu = document.querySelector(menuClass) ? document.querySelector(menuClass) : document.querySelector('head');
	const menuLink = document.querySelector('.menu-link') ? document.querySelector('.menu-link') : document.querySelector('head');
	const menuActive = 'active';

	const burgerMedia = 767;
	const bodyOpenModalClass = 'popup-show';

	let windowWidth = window.innerWidth;
	document.querySelector('.container')?.offsetWidth || 0;

	const checkWindowWidth = () => {
		windowWidth = window.innerWidth;
		document.querySelector('.container')?.offsetWidth || 0;
	};

	//
	//  
	//
	//
	// Проверки

	// Проверка на мобильное устройство
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
	}

	// Проверка на десктоп разрешение 
	function isDesktop() {
		return windowWidth > burgerMedia
	}

	// Проверка поддержки webp 
	function checkWebp() {
		const webP = new Image();
		webP.onload = webP.onerror = function () {
			if (webP.height !== 2) {
				document.querySelectorAll('[style]').forEach(item => {
					const styleAttr = item.getAttribute('style');
					if (styleAttr.indexOf('background-image') === 0) {
						item.setAttribute('style', styleAttr.replace('.webp', '.jpg'));
					}
				});
			}
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}

	// Проверка на браузер safari
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

	// Проверка есть ли скролл 
	function haveScroll() {
		return document.documentElement.scrollHeight !== document.documentElement.clientHeight
	}

	// Закрытие бургера на десктопе
	function checkBurgerAndMenu() {
		if (isDesktop()) {
			menuLink.classList.remove('active');
			if (menu) {
				menu.classList.remove(menuActive);
				if (!body.classList.contains(bodyOpenModalClass)) {
					body.classList.remove('no-scroll');
				}
			}
		}

		if (html.classList.contains('lg-on')) {
			if (isMobile()) {
				body.style.paddingRight = '0';
			} else {
				body.style.paddingRight = getScrollBarWidth() + 'px';
			}
		}
	}

	// Задержка при вызове функции. Выполняется в конце
	function debounce(fn, delay) {
		let timer;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => fn.apply(this, arguments), delay);
		};
	}

	// Закрытие элемента при клике вне него
	function closeOutClick(closedElement, clickedButton, clickedButtonActiveClass, callback) {
		document.addEventListener('click', (e) => {
			const button = document.querySelector(clickedButton);
			const element = document.querySelector(closedElement);
			const withinBoundaries = e.composedPath().includes(element);

			if (!withinBoundaries && button?.classList.contains(clickedButtonActiveClass) && e.target !== button) {
				element.classList.remove('active');
				button.classList.remove(clickedButtonActiveClass);
			}
		});
	}

	window.addEventListener('resize', debounce(checkWindowWidth, 100));

	// Изменение ссылок в меню 
	if (!document.querySelector('body').classList.contains('home') && document.querySelector('body').classList.contains('wp')) {
		let menu = document.querySelectorAll('.menu li a');

		for (let i = 0; i < menu.length; i++) {
			if (menu[i].getAttribute('href').indexOf('#') > -1) {
				menu[i].setAttribute('href', '/' + menu[i].getAttribute('href'));
			}
		}
	}

	// Добавление класса loaded после полной загрузки страницы
	function loaded() {
		document.addEventListener('DOMContentLoaded', function () {
			html.classList.add('loaded');
			if (document.querySelector('header')) {
				document.querySelector('header').classList.add('loaded');
			}
			if (haveScroll()) {
				setTimeout(() => {
					html.classList.remove('scrollbar-auto');
				}, 500);
			}
		});
	}

	// Для локалки
	if (window.location.hostname == 'localhost' || window.location.hostname.includes('192.168')) {
		document.querySelectorAll('.logo, .crumbs>li:first-child>a').forEach(logo => {
			logo.setAttribute('href', '/');
		});

		document.querySelectorAll('.menu a').forEach(item => {
			let firstSlash = 0;
			let lastSlash = 0;

			if (item.href.split('/').length - 1 == 4) {
				for (let i = 0; i < item.href.length; i++) {
					if (item.href[i] == '/') {
						if (i > 6 && firstSlash == 0) {
							firstSlash = i;
							continue
						}

						if (i > 6 && lastSlash == 0) {
							lastSlash = i;
						}
					}
				}

				let newLink = '';
				let removeProjectName = '';

				for (let i = 0; i < item.href.length; i++) {
					if (i > firstSlash && i < lastSlash + 1) {
						removeProjectName += item.href[i];
					}
				}

				newLink = item.href.replace(removeProjectName, '');
				item.href = newLink;
			}
		});
	}

	// Расчет высоты шапки
	function setHeaderFixedHeight() {
		if (!headerTop) return;

		requestAnimationFrame(() => {
			const height = headerTop.offsetHeight;

			document.documentElement.style.setProperty('--headerFixedHeight', height + 'px');
		});
	}

	document.addEventListener('DOMContentLoaded', setHeaderFixedHeight);
	if (window.ResizeObserver) {
		const ro = new ResizeObserver(() => {
			setHeaderFixedHeight();
		});
		ro.observe(headerTop);
	}

	// Проверка на браузер safari
	if (isSafari) document.documentElement.classList.add('safari');

	// Проверка поддержки webp 
	checkWebp();

	// Закрытие бургера на десктопе
	window.addEventListener('resize', debounce(checkBurgerAndMenu, 100));
	checkBurgerAndMenu();

	// Добавление класса loaded при загрузке страницы
	loaded();

	// 
	// 
	// 
	// 
	// Функции для работы со скроллом и скроллбаром

	// Скрытие скроллбара
	function hideScrollbar() {
		// changeScrollbarGutter()

		popup.forEach(element => {
			element.style.display = 'none';
		});

		if (haveScroll()) {
			body.classList.add('no-scroll');
		}

		changeScrollbarPadding();
	}

	function showScrollbar() {
		if (!menu.classList.contains(menuActive)) {
			body.classList.remove('no-scroll');
		}

		changeScrollbarPadding(false);

		// if (haveScroll()) {
		// 	body.classList.add('scrollbar-auto')
		// 	html.classList.add('scrollbar-auto')
		// }
	}

	// Ширина скроллбара
	function getScrollBarWidth$1() {
		let div = document.createElement('div');
		div.style.overflowY = 'scroll';
		div.style.width = '50px';
		div.style.height = '50px';
		document.body.append(div);
		let scrollWidth = div.offsetWidth - div.clientWidth;
		div.remove();

		if (haveScroll()) {
			return scrollWidth
		} else {
			return 0
		}
	}

	// Добавление и удаление отступа у body и фиксированных элементов
	function changeScrollbarPadding(add = true) {
		const scrollbarPadding = getScrollBarWidth$1() + 'px';

		fixedElements.forEach(elem => {
			const position = window.getComputedStyle(elem).position;

			if (position === 'sticky') {
				if (add) {
					if (!stickyObservers.has(elem)) {
						const observer = new IntersectionObserver(([entry]) => {
							if (!entry.isIntersecting) {
								elem.style.paddingRight = scrollbarPadding;
							} else {
								elem.style.paddingRight = '0';
							}
						}, {
							threshold: [1]
						});
						observer.observe(elem);
						stickyObservers.set(elem, observer);
					}
				} else {
					elem.style.paddingRight = '0';
					const observer = stickyObservers.get(elem);
					if (observer) {
						observer.unobserve(elem);
						stickyObservers.delete(elem);
					}
				}
			} else {
				elem.style.paddingRight = add ? scrollbarPadding : '0';
			}
		});

		if (isSafari) {
			body.style.paddingRight = add ? scrollbarPadding : '0';
		}
	}

	/* 
		================================================
		  
		Бургер
		
		================================================
	*/

	function burger() {
		if (menuLink) {
			let isAnimating = false;

			menuLink.addEventListener('click', function (e) {
				if (isAnimating) return
				isAnimating = true;

				menuLink.classList.toggle('active');
				menu.classList.toggle(menuActive);

				if (menu.classList.contains(menuActive)) {
					hideScrollbar();

					const scrollY = window.scrollY;
					const headerHeight = headerTop.offsetHeight;

					if (scrollY === 0) {
						menu.style.removeProperty('top');
					} else if (scrollY < headerHeight) {
						menu.style.top = scrollY + 'px';
					} else {
						const headerRect = headerTop.getBoundingClientRect();
						menu.style.top = headerRect.bottom + 'px';
					}
				} else {
					setTimeout(() => {
						showScrollbar();
					}, 400);
				}

				setTimeout(() => {
					isAnimating = false;
				}, 500);
			});



			function checkHeaderOffset() {
				if (isMobile()) {
					changeScrollbarPadding(false);
				} else {
					if (body.classList.contains(bodyOpenModalClass)) {
						changeScrollbarPadding();
					}
				}

				if (isDesktop()) {
					menu.removeAttribute('style');

					if (!body.classList.contains(bodyOpenModalClass)) {
						body.classList.remove('no-scroll');

						if (isSafari) {
							changeScrollbarPadding(false);
						}
					}
				}
			}

			window.addEventListener('resize', debounce(checkHeaderOffset, 50));
			window.addEventListener('resize', debounce(checkHeaderOffset, 150));

			if (document.querySelector('.header__mobile')) {
				closeOutClick('.header__mobile', '.menu-link', 'active');
			}
		}
	}

	/* 
		================================================
		  
		Карты
		
		================================================
	*/


	function map() {
		let spinner = document.querySelectorAll('.loader');
		let check_if_load = false;

		function loadScript(url, callback) {
			let script = document.createElement("script");
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function () {
					callback();
				};
			}

			script.src = url;
			document.getElementsByTagName("head")[0].appendChild(script);
		}

		function initMap() {
			loadScript("https://api-maps.yandex.ru/2.1/?apikey=5b7736c7-611f-40ce-a5a8-b7fd86e6737c&lang=ru_RU&amp;loadByRequire=1", function () {
				ymaps.load(init);
			});
			check_if_load = true;
		}

		if (document.querySelectorAll('.map').length) {
			let observer = new IntersectionObserver(function (entries) {
				if (entries[0]['isIntersecting'] === true) {
					if (!check_if_load) {
						spinner.forEach(element => {
							element.classList.add('is-active');
						});
						if (entries[0]['intersectionRatio'] > 0.1) {
							initMap();
						}
					}
				}
			}, {
				threshold: [0, 0.1, 0.2, 0.5, 1],
				rootMargin: '200px 0px'
			});

			observer.observe(document.querySelector('.map'));
		}
	}

	function waitForTilesLoad(layer) {
		return new ymaps.vow.Promise(function (resolve, reject) {
			let tc = getTileContainer(layer), readyAll = true;
			tc.tiles.each(function (tile, number) {
				if (!tile.isReady()) {
					readyAll = false;
				}
			});
			if (readyAll) {
				resolve();
			} else {
				tc.events.once("ready", function () {
					resolve();
				});
			}
		});
	}

	function getTileContainer(layer) {
		for (let k in layer) {
			if (layer.hasOwnProperty(k)) {
				if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
					return layer[k];
				}
			}
		}
		return null;
	}

	window.waitForTilesLoad = waitForTilesLoad;
	window.getTileContainer = getTileContainer;

	map();
	burger();

	//
	//
	//
	//
	// Общие скрипты

	// Слайдер 
	if (document.querySelector('.features-swiper')) {
		new Swiper('.features-swiper', {
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

})();
//# sourceMappingURL=script.js.map
