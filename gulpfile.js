// Gulp Nodes.
var gulp        = require( 'gulp' ),
    gulpPlugins = require( 'gulp-load-plugins' )();

var fs = require('fs');

var pkg = JSON.parse(fs.readFileSync('./package.json'));

var del = require('del');

// Deploy files list.
var deploy_files_list = [
	'core/**',
	'languages/**',
	'lib/**',
	'readme.txt',
	pkg.main_file
];

gulp.task('pot', function() {
	const { run } = gulpPlugins;
	return run('wpi18n makepot --domain-path=languages --exclude=vendors,deploy').exec();
})

gulp.task('language', function() {
	const { run } = gulpPlugins;
	return run('wpi18n addtextdomain').exec();
})

gulp.task('clean:deploy', function() {
    return del('deploy')
});

gulp.task('copy:deploy', function() {
	const { zip } = gulpPlugins;
	return gulp.src(deploy_files_list,{base:'.'})
	    .pipe(gulp.dest('deploy/' + pkg.name))
	    .pipe(zip(pkg.name + '.zip'))
	    .pipe(gulp.dest('deploy'))
});

// Tasks.
gulp.task( 'textdomain', gulp.series('language', 'pot'));

gulp.task( 'build', gulp.series('textdomain'));

gulp.task( 'deploy', gulp.series('clean:deploy', 'copy:deploy'));