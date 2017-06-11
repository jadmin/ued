<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>链接集合</title>
</head>
<body>
<?php
if( !defined('ROOT_PATH') ) {
	define( 'ROOT_PATH', dirname(__FILE__) ); // 根路径
}

function is_empty($str) {
	return ( ($str == NULL) || is_null($str) || ($str == '') || (is_array($str) && empty($str)) );
}

function fp_mkdir($pathname, $mode = 0777) {
	// Check if directory already exists
	if (is_dir ( $pathname ) || empty ( $pathname )) {
		return true;
	}

	// Ensure a file does not already exist with the same name
	if (is_file ( $pathname )) {
		trigger_error ('fp_mkdir() File exists.', E_USER_WARNING);
		return false;
	}

	// Crawl up the directory tree
	$next_pathname = substr ($pathname, 0, strrpos ($pathname, "/"));
	if (fp_mkdir($next_pathname, $mode)) {
		if (! file_exists ($pathname)) {
			$rs = mkdir ($pathname, $mode);
			chmod ($pathname, $mode);
			return $rs;
		}
	}
	return false;
}

function cache_write($cache_data, $cache_filename, $namespace = NULL, $mode = 'array') {
	if($cache_data == NULL || is_null($cache_data)) {
		$cache_data = array();
	}
	$cache_filedir = is_empty($namespace) ? (ROOT_PATH . '/data/cache') : (ROOT_PATH . '/data/cache/' . $namespace);
	!is_dir($cache_filedir) ? fp_mkdir($cache_filedir) : '';
	
	$current_umask = umask();
    umask(0000);
	$cache_filepath = $cache_filedir . '/' . $cache_filename;
	if(file_exists($cache_filepath)) {
		unlink($cache_filepath);// 删除文件
	}
	$cache_content = '';
	$fp = @fopen($cache_filepath, 'a');
	if($mode == 'array') {
		$cache_content = "<?php\nreturn " . var_export($cache_data, true) . ";\n?>";
	} elseif ($mode == 'tpl') {
		$cache_content = $cache_data;
	}
	$fw = @fwrite($fp, $cache_content);
	fclose($fp);
	
	chmod($cache_filepath, 0666);
    umask($current_umask);
	unset($cache_content); unset($cache_filepath); unset($cache_filedir);
}

//读取文件缓存
function cache_read($cache_filename, $namespace = NULL, $mode = 'array') {
	$cache_filepath = is_empty($namespace) ? (ROOT_PATH . '/data/cache/' . $cache_filename) : (ROOT_PATH . '/data/cache/' . $namespace . '/' . $cache_filename);
	if(!file_exists($cache_filepath)) {
		return NULL;
	}
	if($mode == 'array') {
		$arr_data = require $cache_filepath;
		return $arr_data;
	} elseif ($mode == 'tpl') {
		include $cache_filepath;
	}
}

function goUrl($url, $status = '302', $time = 0) {
	if(is_numeric($url)) {
		header("Content-type: text/html; charset=".PAGE_CHARSET);
		echo "<script>history.go('$url')</script>";
		flush();
	} else {
		if(headers_sent()) {
			echo "<meta http-equiv=refresh content=\"$time; url=$url\">";
			echo "<script type='text/javascript'>location.href='$url';</script>";
		} else {
			if($status == '302') {
				header("HTTP/1.1 302 Moved Temporarily");
				header("Location: $url");
				exit;
			}
			header("Cache-Control: no-cache, must-revalidate");
			header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
			header("HTTP/1.1 301 Moved Permanently");
			header("Location: $url");
		}
	}
	exit;
}

$link_url = isset($_POST['url']) ? trim($_POST['url']) : '';
$link_name = isset($_POST['name']) ? trim($_POST['name']) : '';
$auth = isset($_POST['auth']) ? trim($_POST['auth']) : '';
if($link_url != '' && $link_name != '' && $auth == 'zqjkxdq') {
	$links = cache_read('urls.php');
	$links = empty($links) ? array() : $links;
	$links[] = array('url' => $link_url, 'name' => $link_name);
	cache_write($links, 'urls.php');
	goUrl('links.php?staus=ok');
}
$staus = isset($_GET['staus']) ? trim($_GET['staus']) : '';
if($staus == 'ok') {
	echo '恭喜，操作已成功！<a href="links.php">返回</a>';
} else {
	$links = cache_read('urls.php');
	if($links != NULL && !empty($links) && count($links) > 0) {
		foreach ($links as $key => $value) {
			echo '<a href="' . $value['url'] . '" target="_blank">' . $value['name'] . '</a>&nbsp;&nbsp;';
		}
	}
}

?>
<p>
<form action="links.php" method="post">
	链接地址：<input type="text" name="url" value="" id="url"><br>
	链接名称：<input type="text" name="name" value="" id="name"><br>
	授权验证：<input type="text" name="auth" value="" id="auth"><br>
	<input type="submit" value="提交">
</form>
</p>
</body>
</html>