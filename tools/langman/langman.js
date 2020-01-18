window.elFinder = function(){};
elFinder.prototype.i18 = {};
(function($){
	$(document).ready(function(){
		var tbl = $('#content');
		var cl = 'even';
		var elf = new elFinder();
		var asMaster = '2.1';
		var src = {}, keys = {}, tpl, locprms, hash, branch, lang;
		var glbs = {
			'translator'      : 'Your name &lt;translator@email.tld&gt;',
			'language'        : 'Name of this language',
			'direction'       : '"ltr"(Left to right) or "rtl"(Right to left)',
			'dateFormat'      : 'For example: "d.m.Y H:i", "M d, Y h:i A", "Y/m/d h:i A" etc.',
			'fancyDateFormat' : '"$1" is replaced "Today" or "Yesterday"',
			'nonameDateFormat': 'to apply if upload file is noname'
		};
		var newLang = 'Please set ISO-639 language code as "xx" or adding ISO-3166 country code as "xx_YY".';
		var langs = {
			xx: 'New language',
			ar: 'العربية',
			bg: 'Български',
			ca: 'Català',
			cs: 'Čeština',
			da: 'Dansk',
			de: 'Deutsch',
			el: 'Ελληνικά',
			en: 'English',
			es: 'Español',
			fa: 'فارسی',
			fo: 'Føroyskt',
			fr: 'Français',
			fr_CA: 'Français (Canada)',
			he: 'עברית',
			hr: 'Hrvatski',
			hu: 'Magyar',
			id: 'Bahasa Indonesia',
			it: 'Italiano',
			ja: '日本語',
			ko: '한국어',
			nl: 'Nederlands',
			no: 'Norsk',
			pl: 'Polski',
			pt_BR: 'Português',
			ro: 'Română',
			ru: 'Pусский',
			si: 'සිංහල',
			sk: 'Slovenčina',
			sl: 'Slovenščina',
			sr: 'Srpski',
			sv: 'Svenska',
			tr: 'Türkçe',
			ug_CN: 'ئۇيغۇرچە',
			uk: 'Український',
			vi: 'Tiếng Việt',
			zh_CN: '简体中文',
			zh_TW: '正體中文'
		};
		var setTitle = function(){
			$('title').text($('title').text().replace(/(elFinder)( [0-9.]+)?/, '$1 '+branch));
			$('#title').html($('#title').html().replace(/(elFinder)( [0-9.]+)?/, '$1 '+branch));
		};
		var init = function(){
			var optTags = [];
			setTitle();
			$("#selbr").val(branch);
			$.each(langs, function(lang, name) {
				optTags.push('<option value="'+lang+'">'+name+'</option>');
			});
			$("#lngsel").append(optTags.join('')).on('change', function() {
				$('#lng').val($(this).val());
				$('#lngbtn').trigger('click');
			});
			$('#glbs').empty();
			$('#content').empty();
			$('#step').hide();
			$('#glbs').on('change', '.direction', function() {
				$this = $(this);
				if ($this.val().trim() === 'rtl') {
					$this.val('rtl');
				} else {
					$this.val('ltr');
				}
				$('body').css('direction', $this.val());
			}).on('change keyup', '.dateFormat,.fancyDateFormat,.nonameDateFormat', function(e) {
				var d = dateFormat($(this).val());
				$(this).nextAll('.preview').text(d);
			});

			src = {};
			keys = {};
			$.getScript('./'+branch+'/i18n/elfinder.LANG.js', function() {
				var hTable;
				$.each(elf.i18.REPLACE_WITH_xx_OR_xx_YY_LANG_CODE.messages, function(k, v){
					var key = k.replace(/[ \.]/g, '_');
					src[key] = v;
					keys[key] = k;
				});
				
				$.get('./'+branch+'/i18n/elfinder.LANG.js', {}, function(data){
					tpl = data;
				});
				$('#lngbtn').on('click focus', function(){
					lang = $('#lng').val();
					
					if (lang === 'xx' || lang === '') {
						alert(newLang);
						$('#lng').val('xx').focus().select();
						return;
					}

					$('#lngsel').val(lang);

					var slng = elf.i18.REPLACE_WITH_xx_OR_xx_YY_LANG_CODE;
					var make;
					var filename = './'+branch+'/i18n/elfinder.'+lang+'.js';
					var tgt = (branch == asMaster)? 'master' : branch + '-src';
					var isNew = false;

					$('#made').val('');
					location.hash = '#'+branch+':'+lang;

					$.getScript(filename)
					.done(function(){
						make = $.extend(true, {}, slng, elf.i18[lang]);
						$('a.editgh').attr('href', 'https://github.com/Studio-42/elFinder/edit/'+tgt+'/js/i18n/elfinder.'+lang+'.js');
					})
					.fail(function(){
						$('#lngsel').val('xx');
						isNew = true;
						make = $.extend(true, {}, slng);
						$('a.editgh').attr('href', 'https://github.com/Studio-42/elFinder/new/'+tgt+'/js/i18n');
						$('#step .step-edit-or-new').html('Input "elfinder.'+lang+'.js" to new file name.');
					})
					.always(function(){
						$('span.langname').text(lang);
						$('span.targetb').text(tgt);
						$.each(src, function(k, v){
							$('#inp-'+k).val(make.messages[keys[k]])[(make.messages[keys[k]] == src[k])?'addClass':'removeClass']('same');
						});
						$.each(glbs, function(k, v){
							var t = $('#glbs-txt-' + k);
							var val = make[k].replace(/&lt;/g, '<').replace(/&gt;/g, '>');
							if (!isNew && t.length > 0) {
								$('#glbs-' + k).data('default', val);
								t.html(make[k] + ', <br>');
							} else {
								$('#glbs-' + k).data('default', '');
								if (!isNew) {
									$('#glbs-' + k).val(val);
								} else {
									if (k === 'translator' || k === 'language') {
										$('#glbs-' + k).val('');
									} else {
										$('#glbs-' + k).val(val);
									}
								}
								t.html('');
							}
							if (k === 'translator') {
								$('#glbs-' + k).val('').attr('placeholder', slng[k].replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
							}
							$('#glbs-' + k).trigger('change');
						});
					});
				});
				$('#lng').on('keydown', function(e){
					if (e.keyCode == 13) {
						$('#lngbtn').trigger('click');
					}
				});
				$('#make').on('click', function(){
					var date = new Date();
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate();
					  
					if ( month < 10 ) {
						month = '0' + month;
					}  
					if ( day < 10 ) {
						day = '0' + day;
					}  

					var lng = $('#lng').val();
					var made = tpl;
					var language = $('#glbs-language').val();
					var head = '/**\n * '+language+' translation\n';
					var authors = ($('#glbs-translator').data('default') || '').split(',').concat($('#glbs-translator').val().split(','));
					$.each(authors, function(k, v){
						if (v.trim()) {
							head += ' * @author '+v.trim()+'\n';
						}
					});
					head += ' * @version '+year+'-'+month+'-'+day+'\n';
					head += ' */\n';
					made = head + made.replace(/^[\s\S]+?(\(function)/, '$1')
					.replace(/(elFinder\.prototype\.i18\.)REPLACE_WITH_xx_OR_xx_YY_LANG_CODE( = {)/, '$1'+lng+'$2')
					.replace(/(\/\*\*\s+\* )XXXXX( translation)/, '$1'+language+'$2');
					$.each(glbs, function(k, v){
						var reg = new RegExp('(\\b'+k+'\\b\\s*:\\s*\').+(\')');
						var def = $('#glbs-'+k).data('default');
						var val = $('#glbs-'+k).val();
						if (def) {
							val = def + (val? ', ' + val : '');
						}
						made = made.replace(reg, function(str, p1, p2){return p1+val.replace(/\\(?=')/, '').replace('\\', '\\\\').replace(/'/g, "\\'").replace(/</g, '&lt;').replace(/>/g, '&gt;')+p2;});
					});
					made = made.replace(/^(.+ : '(.+)',.+ will show like:).*$/mg, function(str, p1, p2) {
						return p1 + ' ' + dateFormat(p2);
					});
					$.each(src, function(k, v){
						var reg = new RegExp('(\''+keys[k]+'\'\\s*:\\s*\').+(\')');
						made = made.replace(reg, function(str, p1, p2){return p1+$('#inp-'+k).val().replace(/\\(?=')/, '').replace('\\', '\\\\').replace(/'/g, "\\'")+p2;});
					});
					$('#step').show();
					$('#made').val(made.replace(/[ \t]+([\r\n])/g, '$1'));
				});
				$('#content').on('change', 'input', function(){
					var k = this.id.substr(4);
					$(this)[($(this).val() == src[k])?'addClass':'removeClass']('same');
				});

				hTable = $('<table class="header"/>').appendTo($('#glbs'));
				$.each(glbs, function(k, v){
					var inp = '';
					if (k === 'translator') {
						inp = '<span id="glbs-txt-'+k+'"></span>';
					}
					inp += '<input id="glbs-'+k+'" class="'+k+'" type="text"><span class="preview"></span><span class="note">'+v+'</span>';
					$('<tr/>').append('<td class="caption">'+k+'</td><td class="input">'+inp+'</td>').appendTo(hTable);
				});
				$.each(src, function(k, v){
					cl = (cl == 'even')? 'odd' : 'even';
					tbl.append($('<tr class="'+cl+'"><td class="caption" id="en-'+k+'" title="'+keys[k]+'">'+v+'</td><td id="lng-'+k+'"><input id="inp-'+k+'" class="mesinp" type="text" title="'+keys[k]+'"></input></td></tr>'));
				});
				$('span.branch').text(branch);
				
				if (lang) {
					$("#lngsel").val(lang);
					$('#lng').val(lang);
					$('#lngbtn').trigger('click');
				}
				$('#made').val('Please click a button [Make it!] .');
				
			});
		};
		var i18n = function(key) {
			return $('#inp-' + key).val();
		};
		var dateFormat = function(format) {
			var date = new Date(),
				output, d, dw, m, y, h, g, i, s, i18;
			
			h  = date.getHours();
			g  = h > 12 ? h - 12 : h;
			i  = date.getMinutes();
			s  = date.getSeconds();
			d  = date.getDate();
			dw = date.getDay();
			m  = date.getMonth() + 1;
			y  = date.getFullYear();

			i18 = {
				months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				monthsShort : ['msJan', 'msFeb', 'msMar', 'msApr', 'msMay', 'msJun', 'msJul', 'msAug', 'msSep', 'msOct', 'msNov', 'msDec'],

				days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				daysShort : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
			};
			
			output = format.replace(/[a-z]/gi, function(val) {
				switch (val) {
					case 'd': return d > 9 ? d : '0'+d;
					case 'j': return d;
					case 'D': return i18n(i18.daysShort[dw]);
					case 'l': return i18n(i18.days[dw]);
					case 'm': return m > 9 ? m : '0'+m;
					case 'n': return m;
					case 'M': return i18n(i18.monthsShort[m-1]);
					case 'F': return i18n(i18.months[m-1]);
					case 'Y': return y;
					case 'y': return (''+y).substr(2);
					case 'H': return h > 9 ? h : '0'+h;
					case 'G': return h;
					case 'g': return g;
					case 'h': return g > 9 ? g : '0'+g;
					case 'a': return h >= 12 ? 'pm' : 'am';
					case 'A': return h >= 12 ? 'PM' : 'AM';
					case 'i': return i > 9 ? i : '0'+i;
					case 's': return s > 9 ? s : '0'+s;
				}
				return val;
			});
			
			output = output.replace('$1', i18n('Today'));

			return output;
		};

		hash = location.hash.replace(/^#/, '').match(/(2\.[01])(?::([a-zA-Z0-9-]{2,5}))/);
		branch = (hash && hash[1])? hash[1] : '2.1';
		lang = (hash && hash[2])? hash[2] : (function() {
			var locq = window.location.search,
				map = {
					'pt' : 'pt_BR',
					'ug' : 'ug_CN',
					'zh' : 'zh_CN'
				},
				full = {
					'zh_tw' : 'zh_TW',
					'zh_cn' : 'zh_CN',
					'fr_ca' : 'fr_CA'
				},
				fullLang, locm, lang;
			if (locq && (locm = locq.match(/lang=([a-zA-Z_-]+)/))) {
				// detection by url query (?lang=xx)
				fullLang = locm[1];
			} else {
				// detection by browser language
				fullLang = (navigator.browserLanguage || navigator.language || navigator.userLanguage || '');
			}
			fullLang = fullLang.replace('-', '_').substr(0,5).toLowerCase();
			if (full[fullLang]) {
				lang = full[fullLang];
			} else {
				lang = (fullLang || 'en').substr(0,2);
				if (map[lang]) {
					lang = map[lang];
				}
			}
			return lang;
		})();

		$('#selbr').on('change', function(e){
			branch = $(this).find('option:selected').val();
			init();
			$('#lngbtn').trigger('click');
		});

		init();
	});
})(jQuery);
