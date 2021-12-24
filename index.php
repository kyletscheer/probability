<?php
//NOTES
/*
CREATE A BELL CURVE WITH THE DATA
SET THE NUMBER OF EACH ITEM, AND THE TOTAL NUMBER OF ITEMS, NOT A PROBABILITY

*/
?>

<?php include 'header.php'; ?>
<title>Bucket Scoop Probability</title>
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
<!--input strt -->
<script type="text/javascript">
$(document).ready(function(){
    var maxField = 10; //Input fields increment limitation
    var addButton = $('.add_button'); //Add button selector
    var wrapper = ('.field_wrapper'); //Input field wrapper
    var fieldHTML = '	<div><td><input placeholder="Ex: banana" type="text" name="field_name[]" value="<?php echo isset($_POST['field_name[]']) ? $_POST['field_name[]'] : '' ?>"/></td><td><input placeholder="Ex: 0.44" type="number" step="0.001" max="1" min="0" name="field_percentage[]" value="<?php echo isset($_POST['field_percentage[]']) ? $_POST['field_percentage[]'] : '' ?>"/></td><td><a href="javascript:void(0);" class="remove_button" title="Remove field">remove</a></td></div>'; //New input field html 
    var x = 1; //Initial field counter is 1
    $(addButton).click(function(){ //Once add button is clicked
        if(x < maxField){ //Check maximum number of input fields
            x++; //Increment field counter
            debugger;
            $(this).closest(wrapper).append(fieldHTML); // Add field html
			//$(wrapper).slideDown(800);
        }
    });
    $(wrapper).on('click', '.remove_button', function(e){ //Once remove button is clicked
        e.preventDefault();
        $(this).parent('div').remove(); //Remove field html
        x--; //Decrement field counter
    });
});
</script>
<!--input end-->
</head>
<body>
<?php include 'nav.php'; ?>
  <!-- Page Content -->
  <div class="container" style="margin-top: 100px">
<div><h1>BUCKET SCOOP PROBABILITY</h1></div>
<div><h4><b>fill</b> a bucket with items | <b>scoop</b> out a random grouping of items | <b>see</b> the probability</h4></div>
<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
<div class="row">
<div class="col-md-5"><h1>STEP 1: CHOOSE ITEMS</h1></div>
<div class="col-md-7">
	<div class="field_wrapper" style="padding-top:40px;">
		<div>
			<table>
				<tr>
					<th><h3>ITEM</h3></th>
					<th><h3>PROBABILITY</h3></th>
					<th></th>
				</tr>
				<tr>
			<!--		<td><div class="field_wrapper"><input placeholder="Ex: banana" type="text" name="field_name[]" value=""/></div></td>
					<td><div class="field_wrapper"><input placeholder="Ex: 0.44" type="number" step="0.001" max="1" min="0" name="field_percentage[]" value=""/></td>
					<td><a href="javascript:void(0);" class="add_button" title="Add field"></div><i class="fa fa-plus-circle" aria-hidden="true"></i></a></td>
					-->
					<div class="field_wrapper">
    <div>
        <td><input placeholder="Ex: banana" type="text" name="field_name[]" value="<?php echo isset($_POST['field_name[]']) ? $_POST['field_name[]'] : '' ?>"/></td><td><input placeholder="Ex: 0.44" type="number" step="0.001" max="1" min="0" name="field_percentage[]" value=""/></td>
        <td><a href="javascript:void(0);" class="add_button" title="Add field">add</a></td>
    </div>
</div></td
				</tr>
			</table>
		</div>
	</div>
	<!--LOOK INTO BELOW WARNING -->
	<div id='inputwarning' style='display:none;'>You've reached the maximum number of items, which is 100</div>
	Number of iterations(max 100,000) - <input type="number" style="width:180px" min="0" max="100000" name="number" placeholder="default 10,000" value=""/>
	<br>
</div>
</div>
<hr>
<div class="row">
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
<hr>
<div class="row">
<div class="col-md-5"><h1>STEP 3: SUBMIT</h1></div>
<div class="col-md-7">
	<div class="center-block" style="margin-top: 75px"><input type="submit" value="Submit"></div>
</div></div>
</form>
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
	$packaged = array();
	$choices = array();
	//this gets the field_names stated in the form
	$field_values_array = $_REQUEST['field_name'];
	//field_values_array becomes choices array
	foreach($field_values_array as $values){
		array_push($choices,$values);
	}
	$likelihood = array();
	//this gets the field_percentages stated in form
	$field_values_array = $_REQUEST['field_percentage'];
	//this converts the field_values_array as likelihood
	foreach($field_values_array as $value){
		array_push($likelihood,$value);
	}
	//this sets the number of hat pulls to run
	if ($_POST['number']){
		$number = $_POST['number'];
	}
	else {
		$number = 10000;
	}
	//this sets the separator that should be used
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
	//this creates the master array
	$master = array();
	//this creates the expected array
	$expectedarray = array();
	//this loops through the number of hat pulls to populate the master array
	for ($d=0;$d<$number;$d++){
		//echo $d+1 . ". "; 
		$combo = array();
		$expected = 1;
		//loops through # of choices
		for ($i=0; $i < count($choices); $i++){
			//mt_rand generates a random number, mt_getrandmax gets the largest possible number rand comes from. This generates a random decimal, which is $random
			$random = mt_rand() / mt_getrandmax();
			//if random decimal is within the probability stated in $likelihood[$i], it will add the associated choice name along with the separator to combo
		//	if (isset($combo[$i])){
				if ($random < $likelihood[$i]){
					$combo[$i] .= $choices[$i] . $separator;
					$expected = $expected * $likelihood[$i];
				}
				else {
					$expected = $expected *(1-$likelihood[$i]);
				}
		//	}
		//	else {
		//	}
		}
		//combines combo array values into single string
		$packaged[$d] = implode("",$combo);
		$packaged[$d] = substr($packaged[$d], 0, strrpos($packaged[$d], $separator));
		//creates a count for each time that particular combination has occurred. If it has already occurred, it adds 1. If it hasn't occurred in the past, it still adds 1 (to zero
		if ($master[$packaged[$d]]){
			$master[$packaged[$d]] = $master[$packaged[$d]] + 1;
		}
		else {
			$master[$packaged[$d]] = "1";
		}
		$expectedarray[$packaged[$d]]= $expected;
	}
	//if the form was submitted, create a table outlining the choices and likelihoods submitted in the form, along with the table with the results
/*	for (int $i=0; $i < count($master); $i++){
		$master[
	}
for(int i=0; i < count($choices); $i++){
		if(strpos($packaged[$d], $choices[$i]) !== false){
			$expected[$likelihood[$]]
		}
	}*/
?>
<div class="row">
<div class="col-md-2"></div>
<div class="col-md-8">
<table class="table">
<thead><tr><th>item</th><th>probability</th></tr></thead>
<tbody>
<?php
	for ($e=0; $e < count($choices); $e++){
		echo "<tr><td>" . $choices[$e] . "</td><td>" . $likelihood[$e] . "</td></tr>";
	}
?>
</tbody>
</table>
</div>
<div class="col-md-2"></div>
</div>
<div class="row">
<div class="col-md-2"></div>
<div class="col-md-8">
<table id="example" class="display" cellspacing="0" width="100%">
	<thead>
		<tr>
			<th>Combination</th>
			<th>#(out of <?php echo $number ?>)</th>
			<th>Percentage</th>
			<th>Expected Percentage</th>
		</tr>
	</thead>
	<tbody>	
<?php
//pulls the master and choices arrays and outputs them, along with calculating the percent
$sum = 0;
foreach($master as $x=>$x_value)
  {
  $sum = $sum + (((($x_value/$number)-($expectedarray[$x]))*(($x_value/$number)-($expectedarray[$x])))/($expectedarray[$x]));
  }
foreach($master as $x=>$x_value)
  {
  echo "<tr><td>" . $x . "</td><td>" . $x_value . "</td><td>" . round((($x_value/$number)*100),3) . "%</td><td>" . round(($expectedarray[$x]*100),3) . "%</td></tr>";
  }
?>
</tbody></table>
<?php
	echo "<h1>Chi-Squared Value = " . round($sum,8) . "</h1>";
	}
	else {
		echo "<h2>Choose your items and the probability of those being chosen above or to the left.</h2>";
	}
?>
</div>
<div class="col-md-2"></div>
</div>
</div>
<?php include 'footer.php'; ?>

<!--
choose variables. read number of variables. 
Calculate total loops optimal and report. 
Make it changeable.
Report combo|number|percent
"Run again" button
-->