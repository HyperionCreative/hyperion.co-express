<?php

if (!(isset($_REQUEST) && isset($_REQUEST['formData']) && isset($_REQUEST['shownPrice']))) {
    die();
}

$form_data = array();
parse_str($_REQUEST['formData'], $form_data);

$shown_price = $_REQUEST['shownPrice'];

$email_headers = "MIME-Version: 1.0\r\n";
$email_headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
$email_headers .= "From: no-reply@hyperion.co<no-reply@hyperion.co>\r\nReply-To: {$form_data['email']}";

$email_body =
"<p>Website type: <strong>{$form_data['website-type']}</strong><br>
Number of pages: <strong>{$form_data['number-of-pages']}</strong><br>
Need cms: <strong>{$form_data['need-cms']}</strong><br>
Have logo: <strong>{$form_data['have-logo']}</strong>
Give credits: <strong>{$form_data['give-credits']}</strong></p>
<p>Shown price: <strong>{$shown_price}</strong></p>";

mail('cosmin@hyperion.co', 'Hyperion Express', html_entity_decode($email_body), $email_headers);

echo '{"status_code": 1}';

die();
