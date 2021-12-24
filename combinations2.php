<?php

//NOTES

/*

$listarray = array("");

$numberofitems = 1;

$combinationarray = array("");

$separator = ", ";

*/

?>



<?php include 'header.php'; ?>

<title>Item Combinator</title>

<!--outside resources end -->

<!--datatables start -->

	<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.css">

		<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/buttons/1.5.6/css/buttons.dataTables.min.css">



	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/buttons/1.5.6/js/dataTables.buttons.min.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/buttons/1.5.6/js/buttons.flash.min.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/buttons/1.5.6/js/buttons.html5.min.js"></script>

	<script type="text/javascript" charset="utf8" src="//cdn.datatables.net/buttons/1.5.6/js/buttons.print.min.js"></script>

	<script>

	$(document).ready(function(){

		$('#example').DataTable( {

        dom: 'Bfrtip',

        buttons: [

            'copy', 'csv', 'excel', 'pdf', 'print'

		],

		"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]

		} );

	} );

	</script>

<!--datatables end-->
</head>

<body>

<?php include 'nav.php'; ?>

  <!-- Page Content -->

  <div class="container" style="margin-top: 100px">

<div><h1>Combination List Generator</h1></div>
<div><a href="combinations.php" target="blank">Want to specify the length of the combination? Click here.</a></div>
<div><h4>1. Submit a list of items.<strike>2. Set a separator.</strike> 3. Go!</h4></div>

<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">

<div class="row">

<div class="col-md-5"><h1>STEP 1: SUBMIT A LIST OF ITEMS (one item per line)</h1></div>

<div class="col-md-7">

	<div class="field_wrapper" style="padding-top:40px;">

		<textarea rows="10" cols="25" name="text"> </textarea>

	</div>
	<br>

</div>

</div>

<hr>

<!--<div class="row">

<div class="col-md-5"><h1>STEP 2: CHOOSE SEPARATOR</h1></div>

<div class="col-md-7">

	Separator options-

	<br>

	<p style="font-size:8px"><i>ex: apple,banana,orange</i></p>

<label class="radiobuttons">none

  <input type="radio" checked="checked" name="separator" value="">

  <span class="checkmark"></span>

</label>

<label class="radiobuttons">[space]

  <input type="radio" name="separator" value=" ">

  <span class="checkmark"></span>

</label>

<label class="radiobuttons">.

  <input type="radio" name="separator" value=".">

  <span class="checkmark"></span>

</label>

<label class="radiobuttons">,

  <input type="radio" name="separator" value=",">

  <span class="checkmark"></span>

</label>

<label class="radiobuttons">custom

  <input type="radio" name="separator" value="custom">

  <span class="checkmark"></span>

</label>

<input size="30" type="text" placeholder="type custom separator here" name="custom_separator" />

</div>

</div>

-->

<hr>

<div class="row">

<div class="col-md-5"><h1>STEP 3: SUBMIT</h1></div>

<div class="col-md-7">

	<div class="center-block" style="margin-top: 75px"><input type="submit" value="Submit"></div>

</div></div>

</form>

<?php

//functions to create combinationarray

function printCombination($listarray, $n, $r, $separator) {

	$combinationarray = array();

	combinationUtil($listarray, $separator, $combinationarray, 0, $n - 1, 0, $r);

}

function combinationUtil($listarray, $separator, $combinationarray, $start, $end, $index, $r)

    {

	if ($index == $r) {

		echo "<tr><td>";

		for ($j = 0; $j < $r; $j++){
		//	echo $combinationarray[$j] . "$separator";
			echo $combinationarray[$j];
		}
		echo "</td><td>" . $r . "</td></tr>";
    }

	for ($i = $start; $i <= $end && $end - $i + 1 >= $r - $index; $i++){

		$combinationarray[$index] = $listarray[$i];

		combinationUtil($listarray, $separator, $combinationarray, $i + 1, $end, $index + 1, $r);

    }

}			

//create $listarray from submission

	$text = $_POST["text"];

	$listarray = explode(PHP_EOL, $text);

	$n = sizeof($listarray);

	$error="";


//get separator

	if ($_POST['separator']){

		if ($_POST['separator'] == "custom") {

			$separator = $_POST['custom_separator'];

		}

		else {

			$separator = $_POST['separator'];

		}

	}

	else {

		$separator = "";

	}

//create combinations

	//use if to ensure it doesn't exist already

	//use separator when appending to an array element

//output combinations

if ($error==""){

?>
<div class="row">
	<div class="col-md-2"></div>
	<div class="col-md-8">
		<table>
		<tr><th>Submitted List</th></tr>
		<?php
			for ($i=0; $i < sizeof($listarray); $i++){
				echo "<tr><td>" . $listarray[$i] . "</td></tr>";
			}
		?>
		</table>
	</div>
	<div class="col-md-2"></div>
</div>
<br><br>
<div class="row">
<div class="col-md-2"></div>
<div class="col-md-8">
<table id="example" class="display" cellspacing="0" width="100%">
	<thead>
		<tr>
			<th>Combination</th>
			<th>Length</th>
		</tr>
	</thead>
	<tbody>	
<?php
for ($i = 0; $i < $n; $i++){
	$r = $i+1;
printCombination($listarray, $n, $r, $separator);
}
?>
</tbody>
</table>
<?php

}

else {

	echo "<h1>" . $error . "</h1>";

	echo "<h1>" . $error . "</h1>";

}

?>

</div>

<div class="col-md-2"></div>

</div>

</div>

<?php include 'footer.php'; ?>