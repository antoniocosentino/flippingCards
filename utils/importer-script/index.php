<?
$link = mysqli_connect("localhost", "root", "root", "dictionary");

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

echo "Connected: " . mysqli_get_host_info($link) . PHP_EOL;

function giveError( $word, $counter ) {
    return;
    echo "<span style=\"color: red;\">ERROR: " . $word . ", " . $counter . "</span>";
    echo "<br />";
}

$row = 1;

$full_array = [];
$count = 0;

$file = "de-en.txt";
//$file = "de-en_light.txt";

if (($handle = fopen($file, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 100000, ",")) !== FALSE) {
        $row = $data[0];
        $count++;

        // resetting everything
        $de_en_array = [];
        $de_array = [];
        $deword = null;
        $enword = null;
        $dewordarray = [];
        $singulardeword = null;
        $cleandeword = null;
        ////

        $de_en_array = explode( "::", $row );


        if (count($de_en_array) < 2) {
            giveError( $row, $count );
            continue;
        }

        $de_array = explode( ";", $de_en_array[0] );
        $deword = $de_array[0];
        $enword = $de_en_array[1];


        $dewordarray = explode( "|", $deword );
        $enwordarray = explode( "|", $enword );

        $singulardeword = $dewordarray[0];
        $singularenword = $enwordarray[0];


        $singularenwordarr = explode( ";", $enwordarray[0] );
        
        preg_match('/[^{]*/', $singulardeword, $matches);
        $cleandeword = trim($matches[0]);

        $curlyregex = '/{\K[^}]*(?=})/m';

        preg_match_all($curlyregex, $singulardeword, $matches2);

        $type = $matches2[0][0];

        $temp = [];

        $articlesRegex = '/^(das|der|die) /i';

        $cleandewordWithoutArticle = preg_replace( $articlesRegex, '', $cleandeword );

        $temp['de'] = $cleandewordWithoutArticle;
        $temp['en'] = trim($singularenwordarr[0]);
        $temp['wordType'] = $type;

        if ( $type ) {
            //$full_array[] = $temp;
            echo "<pre>";
            print_r($temp);
            echo "</pre>";

            $query = "INSERT INTO dictionary ( de, en, wordType) VALUES ( '" . $link->real_escape_string($temp['de']) .  "', '" . $link->real_escape_string($temp['en']) .  "', '" . $temp['wordType'] .  "')";

            echo $query;

            if ($link->query( $query )) {
                echo "<br />";
                printf("%d Row inserted.\n", $link->affected_rows);
            }

            echo "<hr />";

            flush();
        }
    }
}

// echo "<pre>";
// print_r( $full_array );
// echo "</pre>";
?>