<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * block editor.
 *
 * Plugin Name: GanonPress
 * @package ganonpress
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_wordpress_block_ganonpress_block_init() {
	if ( ! function_exists( 'register_block_type' ) ) {
		// GB not active
		return;
	}

	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "ganonpress/ganonpress" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'ganonpress-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$editor_css = 'editor.css';
	wp_register_style(
		'ganonpress-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'style.css';
	wp_register_style(
		'ganonpress-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type(
		'ganonpress/draw',
		[
			'editor_script' => 'ganonpress-block-editor',
			'editor_style'  => 'ganonpress-block-editor',
			'style'         => 'ganonpress-block',
		]
	);
}
add_action( 'init', 'create_wordpress_block_ganonpress_block_init' );
