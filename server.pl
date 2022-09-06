#!/usr/bin/perl -w

use Mojolicious::Lite -signatures;
use Try::Tiny;

sub passgen {

    my $length = $_[0];

    $password = "";

    @vals = split "", "0x1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-?!@^&*()$€";

    for (0 .. $length){
        $password .= $vals[ rand($#vals) ];
    }
    return $password; 
};

sub is_numeric {
  my ($x) = @_;
  my $numeric = 1;
  try {
    use warnings FATAL => qw/numeric/;
    0 + $x;
  }
  catch {
    $numeric = 0;
  };
  return $numeric;
};

get '/:password_len' => sub ($c) {
    my $len = $c->param('password_len');
    my passwd_len = 16
    if ( is_numeric($len) ){
        $passwd_len = 16 if ($passwd_len - 255 < 0);
    }

    $password = passgen($passwd_len);
    $c->render(json => {passwd => $password});

};

# Start the Mojolicious command system
app->start;