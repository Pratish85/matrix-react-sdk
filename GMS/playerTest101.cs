//Get player input
key_left = keyboard_check(vk_left) || keyboard_check(ord("A"));
key_right = keyboard_check(vk_right) || keyboard_check(ord("D"));
key_top = keyboard_check(vk_up) || keyboard_check(ord("W"));
key_bottom = keyboard_check(vk_down) || keyboard_check(ord("S"));


//Calc Movement
var moveH = key_right - key_left;

hsp = moveH * walkspd;

var moveV = key_bottom - key_top;

vsp = moveV * walkspd;

/*
if (place_meeting(x, y+1, obj_wall)) && (key_jump)
{
	vsp = -7;	
}
*/
//Horizontal Collision
if (place_meeting(x+hsp, y,obj_wall))
{
	while (!place_meeting(x+sign(hsp), y, obj_wall))
	{
		x = x + sign(hsp);
	}
	hsp = 0;
}
x = x + hsp;

//Vertical Collision
if (place_meeting(x, y+vsp,obj_wall))
{
	while (!place_meeting(x, y+sign(vsp), obj_wall))
	{
		y = y + sign(vsp);
	}
	vsp = 0;
}
y = y + vsp;
/*
//Animation
if (!place_meeting(x, y+1, obj_wall))
{
	sprite_index = spr_playerAir;
	image_speed = 0; //multiplier to animation speed, 0 means no animation.
	if (sign(vsp)>0) image_index = 1; // 2nd frame is index 1.
	else image_index = 0; // 1st frame is index 0.
}
else
{
	
}
*/
image_speed = 1;
	if (hsp == 0)
	{
		sprite_index = spr_player;
	}
	else
	{
		sprite_index = spr_playerRun;
	}

if (hsp != 0) image_xscale = sign(hsp);


