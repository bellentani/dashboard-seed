module.exports = function(grunt) {
	var globalConfig = {
		projectName: 'boot-model',
		localDev: 'src/',
		localMockup: 'mockups/',
		localSamples: 'samples/',
		sourceSafe: 'public/',
		staticDir: '../vm2-static/public/pages'
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		globalConfig: globalConfig,
		//limpa CSS
		uncss: {
			dist: {
				files: [{
        	src: '<%= globalConfig.localMockup  %>*.html',
        	dest: '<%= globalConfig.localMockup  %>css/bootstrap-custom-opt.css'
				}],
        ignore: [
        	'.scrolling',
					'.resizing',
					'.opened-menu',
					'.open',
					'.fixed',
					'.header.fixed'
        ],
        stylesheets: [
        	'<%= globalConfig.localMockup  %>css/bootstrap-custom.css'
        ],
        ignoreSheets: [
        	'<%= globalConfig.localMockup  %>css/plugins.css'
        ]
			}
		},
		//minifica CSS
		cssmin: {
		  minify: {
		    expand: true,
		    cwd: '<%= globalConfig.localMockup  %>css/',
		    src: ['*.css', '!*.min.css'],
		    dest: '<%= globalConfig.localMockup  %>css/',
		    ext: '.min.css'
		  },
		  dist: {
		  	files: [{
					src: '<%= globalConfig.localMockup  %>css/bootstrap-custom-opt.css',
					dest: '<%= globalConfig.localMockup  %>css/bootstrap-custom-opt.min.css'
				}]
		  }
		},
		//melhora os JS e combina
		uglify: {
		    dist: {
				options: {
					sourceMap: true,
					sourceMapName: '<%= globalConfig.localDev  %>/js/JSsourceMap.map'
				},
				files: {
					'<%= globalConfig.localDev  %>/js/all-plugins.min.js':
					[
						'<%= globalConfig.localDev  %>/js/plugins/icheck.js',
						'<%= globalConfig.localDev  %>/js/plugins/ekko-lightbox.js',
						'<%= globalConfig.localDev  %>/js/plugins/jasny-bootstrap.min.js',
						'<%= globalConfig.localDev  %>/js/plugins/jquery.selectBoxIt.js',
						'<%= globalConfig.localDev  %>/js/plugins/mCustomScrollbar.js',
						'<%= globalConfig.localDev  %>/js/plugins/pwstrength-bootstrap-1.1.2.min.js',
						'<%= globalConfig.localDev  %>/js/plugins/equalizer.js',
						'<%= globalConfig.localDev  %>/js/plugins/mediaelement-and-player.min.js'
					]
				}
		    },
		    main: {
		      files: {
		        '<%= globalConfig.localDev  %>/js/main.min.js': ['<%= globalConfig.localDev  %>/js/main.js']
		      }
		    }
		},
		//Copia arquivos específicos do DEV para Mockups
		copy: {
		  devroot: {
	        files: [
	          {expand: true, cwd: '<%= globalConfig.localDev  %>', src:['*.*', '!**/*.{scss,html}', '!<%= globalConfig.localDev  %>includes-html', '!<%= globalConfig.localDev  %>sass'], dest: '<%= globalConfig.localMockup  %>', filter: 'isFile'}
	        ]
	      },
      devimg: {
        files: [
          {expand: true, cwd: '<%= globalConfig.localDev  %>img', src:['**/*.{png,jpg,gif,svg}'], dest: '<%= globalConfig.localMockup  %>img'}
        ]
      },
      devjs: {
        files: [
          {expand: true, cwd: '<%= globalConfig.localDev  %>js', src:['**/*.js'], dest: '<%= globalConfig.localMockup  %>js'}
        ]
      },
      devfonts: {
        files: [
          {expand: true, cwd: '<%= globalConfig.localDev  %>fonts', src:['**/*.{eot,svg,ttf,woff,woff2}'], dest: '<%= globalConfig.localMockup  %>fonts'}
        ]
      },
      devsfw: {
        files: [
         {expand: true, cwd: '<%= globalConfig.localDev  %>swf', src:['*.swf'], dest: '<%= globalConfig.localMockup  %>swf'}
        ]
      },
      //para deploy no sourcesafe
      deploy: {
        files: [{
					expand: true,
					cwd: '<%= globalConfig.localMockup  %>',
					src: ['**/*.css', '**/*.{png,jpg,gif,svg}', '**/*.js', '**/*.{eot,svg,ttf,woff,woff2}', '!**/*.{scss,html}'],
					dest: '<%= globalConfig.sourceSafe  %>'
				}]
			},
			//para deploy no sourcesafe
      static: {
        files: [
          {expand: true, cwd: '<%= globalConfig.localMockup  %>', src:['**'], dest: '<%= globalConfig.staticDir %>/<%= globalConfig.projectName %>/<%= globalConfig.localMockup %>'}
        ]
      },
			samples: {
        files: [
          {expand: true, cwd: '<%= globalConfig.localSamples  %>', src:['**'], dest: '<%= globalConfig.staticDir %>/<%= globalConfig.projectName %>/<%= globalConfig.localSamples %>'}
        ]
      }
    },
		// Delete files not used on mockups
		// delete_sync: {
		//   dist: {
		//     cwd: '<%= globalConfig.localMockup  %>',
		//     src: ['**', '!**/*.scss', '!**/*.sass', '!<%= globalConfig.localDev  %>includes-html', '!**/*.css', '!.sass-cache'],
		//     syncWith: '<%= globalConfig.localDev  %>'
		//   }
		// },
		// Build the site using grunt-includes
    includes: {
      build: {
        cwd: '<%= globalConfig.localDev  %>',
        src: [ '*.html'],
        dest: '<%= globalConfig.localMockup  %>',
        options: {
          flatten: true,
          includePath: '<%= globalConfig.localDev  %>includes-html'
        }
      }
    },
		compass: {
			dev: {
				options: {
					sassDir: '<%= globalConfig.localDev  %>sass/',
					cssDir: '<%= globalConfig.localMockup  %>css',
					debugInfo: false,
					sourcemap: true,
					outputStyle: 'compressed'
				}
			},
			dist: {
				options: {
					sassDir: '<%= globalConfig.localDev  %>sass/',
					cssDir: '<%= globalConfig.localMockup  %>css',
					debugInfo: false,
					sourcemap: true,
					outputStyle: 'compressed'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['compass:dev']
			},
			html: {
				files: '<%= globalConfig.localDev  %>**/*.html',
				tasks: ['includes']
			},
			copy: {
        files: ['<%= globalConfig.localDev  %>*.*', '<%= globalConfig.localDev  %>img/*.{png,jpg,gif,svg}', '<%= globalConfig.localDev  %>fonts/*.{eot,svg,ttf,woff,woff2}', '<%= globalConfig.localDev  %>js/**/*.js'],
        tasks: ['copy:devroot', 'copy:devimg', 'copy:devjs', 'copy:devfonts'],
        options: {
          event: ['added', 'changed'],
        }
	    },
	    // delete_sync: {
	    // 	files: ['**', '!*.scss', '!**/*.css', '!<%= globalConfig.localDev  %>**/*.css'],
	    //   tasks: ['delete_sync']
			// }
		}
	});
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-contrib-uglify');;
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-delete-sync');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', [
		'watch'
	]);
	grunt.registerTask('projeto',[
		'compass:dev',
		'includes',
		'copy:devroot',
		'copy:devimg',
		'copy:devjs',
		'copy:devfonts'
	]);
	grunt.registerTask('dist', [
		'uglify:dist',
		'uglify:main',
		'cssmin:minify'
	]);
	grunt.registerTask('deploy', [
		'compass:dev',
		'includes',
		'copy:devroot',
		'copy:devimg',
		'copy:devjs',
		'copy:devfonts',
		'copy:deploy'
	]);
	grunt.registerTask('static', [
		'compass:dev',
		'includes',
		'copy:devroot',
		'copy:devimg',
		'copy:devjs',
		'copy:devfonts',
		'copy:static',
		'copy:samples'
	]);
	grunt.registerTask('build', [
	  'useminPrepare',
	  'concat:generated',
	  'cssmin:generated',
	  'uglify:generated',
	  'filerev',
	  'usemin'
	]);
}
