<?php
$url = "http://45.43.62.100:4000/question?params=title1&only_url=1";
$response = file_get_contents($url);
$data = json_decode($response, true);

header("Content-Type: application/voicexml+xml");
echo '<?xml version="1.0" encoding="UTF-8"?>
<vxml version="2.1">
    <form>
        <block>
            <assign name="audioFile" expr="' . $data["url"] . '"/>
        </block>
    </form>
</vxml>';
?>
