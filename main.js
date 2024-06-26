var button_random;
var button_center;
var button_clear;
var button_fulcrum;
var world;
var world_scale = 30;
var hit_effect;
var border_box_bottom = new Array();
var lever = new Array();
var fulcrum = new Array();
var fulcrum_joint = new Array();
var fulcrum_bar = new Array();
var box_left = new Array();
var box_left_weld_joint = new Array();
var box_right = new Array();
var box_right_weld_joint = new Array();
var lever_x = 390;
var lever_y = 0;
var fulcrum_x_holder = 390;
var fulcrum_y = lever_y;
var box_left_x = 110;
var box_left_y = 100;
var box_right_x = 670;
var box_right_y = box_left_y;
var box_dimension = 400;
var physics_counter = 0;
var box_left_weight_holder = 1;
var box_right_weight_holder = 1;
var weight_divisor = 50;
var box_left_tiles = new Array();
var box_right_tiles = new Array();
var menu = new Array();
var menu_total = 7;
var menu_start_x = -225;
var menu_start_y = 570;
var menu_width = 200;
var strip = new Array();
var strip_counter = 0;
var strip_scale = 1;
var strip_dimension = 70;
var render_state = "none";
var drag_front = false;
const radians_to_degrees = 180 / Math.PI;
var color_data = new Array();
var b2Vec2;
var b2AABB;
var b2BodyDef;
var b2Body;
var b2FixtureDef;
var b2Fixture;
var b2World;
var b2PolygonShape;
var b2CircleShape;
var b2RevoluteJointDef;
var b2WeldJointDef;
var b2DistanceJointDef;
var b2DebugDraw;
var b2Listener;
var inital_sound = false;
var sound_initial;
var sound_trash;
var sound_placement;
var exerciseList = [
  "Weights",
  "Dancing",
  "Walking",
  "Calisthenics",
  "Yard Work",
  "Golfing",
  "Jump Rope"
  // Add more words as needed
];

function init() {
  canvasInUse = true;
  document.getElementById("game_container").style.display = "inline";
  setInteractiveParameters();
  set_data();
  sound_initial = new Howl({
    src: [
      "/shared/sound/sound_initial.mp3",
      "/shared/sound_initial.ogg",
      "/shared/sound/sound_initial.wav",
    ],
  });
  sound_trash = new Howl({
    src: [
      "/page/" + page + "/sound/sound_trash.mp3",
      "/page/" + page + "/sound/sound_trash.ogg",
      "/page/" + page + "/sound/sound_trash.wav",
    ],
  });
  sound_placement = new Howl({
    src: [
      "/page/" + page + "/sound/sound_placement.mp3",
      "/page/" + page + "/sound/sound_placement.ogg",
      "/page/" + page + "/sound/sound_placement.wav",
    ],
  });
  button_random = new MovieClip(
    document.getElementById("button_random").cloneNode(true)
  );
  button_random.x = 60;
  button_random.y = 700;
  button_random.transform();
  stage.appendChild(button_random.instance);
  button_center = new MovieClip(
    document.getElementById("button_center").cloneNode(true)
  );
  button_center.x = 400;
  button_center.y = 700;
  button_center.transform();
  stage.appendChild(button_center.instance);
  button_clear = new MovieClip(
    document.getElementById("button_clear").cloneNode(true)
  );
  button_clear.x = 740;
  button_clear.y = 700;
  button_clear.transform();
  stage.appendChild(button_clear.instance);
  button_fulcrum = new MovieClip(
    document.getElementById("button_fulcrum").cloneNode(true)
  );
  button_fulcrum.y = 420;
  button_fulcrum.dragRestricted = true;
  button_fulcrum.dragMinimumX = 390;
  button_fulcrum.dragMaximumX = 390;
  button_fulcrum.dragMinimumY = button_fulcrum.y;
  button_fulcrum.dragMaximumY = button_fulcrum.y;
  button_fulcrum.dragMoveHandler = function () {};
  button_fulcrum.dragStopHandler = function () {
    fulcrum_x_holder = this.x;
    render_state = "create_world";
  };
  hit_effect = new MovieClip(
    document.getElementById("hit_effect").cloneNode(true)
  );
  hit_effect.frame_total = 6;
  hit_effect.frames = new Array();
  for (var m = 1; m <= hit_effect.frame_total; m++) {
    hit_effect.frames[m] = hit_effect.instance.querySelector("#frame" + m);
  }
  hit_effect.smoke = [1, 2, 3, 4, 5, 6];
  hit_effect.playFrames([6]);
  stage.appendChild(hit_effect.instance);
  for (var i = 1; i <= menu_total; i++) {
    menu_item(i);
  }
  world = new b2World(new b2Vec2(0, 10), true);
  create_lever(
    fulcrum_x_holder,
    box_left_weight_holder,
    box_right_weight_holder
  );
  requestAnimationFrame(update_timer_handler);
  addPointerListeners();
}
function menu_item(id) {
  menu[id] = new MovieClip(document.getElementById("strip").cloneNode(true));
  menu[id].scale = strip_scale;
  menu[id].x = menu_start_x + (id - 1) * menu_width;
  menu[id].y = menu_start_y;
  menu[id].transform();
  menu[id].area = menu[id].instance.querySelector(".area");
  menu[id].area.setAttribute("fill", color_data[id]);
  menu[id].text = menu[id].instance.querySelector(".number");
  menu[id].text.textContent = exerciseList[id - 1];
  menu[id].text.style.fontSize = "19px"; 
  // menu[id].text.style.textAnchor = "middle"; // Center the text
  // menu[id].text.setAttribute("text-anchor", "middle"); // Center the text

  menu[id].instance.setAttribute("data-id", id);
  stage.appendChild(menu[id].instance);
}
function strip_item(type, x, y) {
  strip_counter++;
  strip[strip_counter] = new MovieClip(
    document.getElementById("strip").cloneNode(true)
  );
  strip[strip_counter].scale = strip_scale;
  strip[strip_counter].x = x;
  strip[strip_counter].y = y;
  strip[strip_counter].transform();
  strip[strip_counter].hitX = strip_dimension / 2;
  strip[strip_counter].hitY = strip_dimension / 2;
  strip[strip_counter].hitWidth = strip_dimension / 2;
  strip[strip_counter].hitHeight = strip_dimension / 2;
  strip[strip_counter].type = type;
  strip[strip_counter].id = strip_counter;
  strip[strip_counter].area =
    strip[strip_counter].instance.querySelector(".area");
  strip[strip_counter].area.setAttribute("fill", color_data[type]);
  strip[strip_counter].text =
    strip[strip_counter].instance.querySelector(".number");
  strip[strip_counter].text.textContent = exerciseList[type-1];
  strip[strip_counter].text.style.fontSize = "21px";
  // strip[strip_counter].text.style.textAnchor = "middle";
  strip[strip_counter].instance.setAttribute("data-id", strip_counter);
  strip[strip_counter].dragFront = true;
  strip[strip_counter].tweenComplete = function () {};
  strip[strip_counter].dragMoveHandler = function () {};
  strip[strip_counter].dragStopHandler = function () {
    var valid = false;
    var angle = lever[physics_counter].physics_data.GetAngle();
    var n = lever_y - Math.tan(angle) * lever_x;
    var compare = Math.tan(angle) * this.x + n;
    if (this.y <= compare) {
      valid = true;
    }
    if (valid) {
      var distance_left = getDistance(
        this.x,
        box_left[physics_counter].x,
        this.y,
        box_left[physics_counter].y
      );
      var distance_right = getDistance(
        this.x,
        box_right[physics_counter].x,
        this.y,
        box_right[physics_counter].y
      );
      if (distance_left < distance_right) {
        sound_placement.play();
        box_left_weight_holder += Number(this.type);
        box_left_tiles.push(this.id);
        this.x -= box_left[physics_counter].x;
        this.y -= box_left[physics_counter].y;
        this.transform();
        box_left[physics_counter].instance.appendChild(this.instance);
      } else {
        sound_placement.play();
        box_right_weight_holder += Number(this.type);
        box_right_tiles.push(this.id);
        this.x -= box_right[physics_counter].x;
        this.y -= box_right[physics_counter].y;
        this.transform();
        box_right[physics_counter].instance.appendChild(this.instance);
      }
      render_state = "create_world";
    } else {
      strip_remove(this.id, this.x, this.y);
    }
  };
  strip[strip_counter].instance.addEventListener("pointerdown", strip_handler);
  return strip[strip_counter];
}
function remove_lever() {
  stage.removeChild(lever[physics_counter].instance);
  stage.removeChild(box_left[physics_counter].instance);
  stage.removeChild(box_right[physics_counter].instance);
  world.DestroyBody(border_box_bottom[physics_counter].physics_data);
  world.DestroyBody(lever[physics_counter].physics_data);
  world.DestroyBody(box_left[physics_counter].physics_data);
  world.DestroyBody(box_right[physics_counter].physics_data);
  world.DestroyBody(fulcrum[physics_counter].physics_data);
  world.DestroyBody(fulcrum_bar[physics_counter].physics_data);
  world.DestroyJoint(fulcrum_joint[physics_counter].physics_data);
  world.DestroyJoint(box_left_weld_joint[physics_counter].physics_data);
  world.DestroyJoint(box_right_weld_joint[physics_counter].physics_data);
}
function create_lever(fulcrum_x, box_left_weight, box_right_weight) {
  physics_counter++;
  button_fulcrum.x = fulcrum_x;
  button_fulcrum.transform();
  stage.appendChild(button_fulcrum.instance);
  border_box_bottom[physics_counter] = new MovieClip(
    document.getElementById("border").cloneNode(true)
  );
  border_box_bottom[physics_counter].area =
    border_box_bottom[physics_counter].instance.querySelector(".area");
  border_box_bottom[physics_counter].x = 390;
  border_box_bottom[physics_counter].y = 502;
  border_box_bottom[physics_counter].transform();
  border_box_bottom[physics_counter].width = 800;
  border_box_bottom[physics_counter].height = 20;
  border_box_bottom[physics_counter].rotation = 0;
  border_box_bottom[physics_counter].physics_type = b2Body.b2_staticBody;
  border_box_bottom[physics_counter].area.setAttribute(
    "x",
    (-1 * border_box_bottom[physics_counter].width) / 2
  );
  border_box_bottom[physics_counter].area.setAttribute(
    "y",
    (-1 * border_box_bottom[physics_counter].height) / 2
  );
  border_box_bottom[physics_counter].area.setAttribute(
    "width",
    border_box_bottom[physics_counter].width
  );
  border_box_bottom[physics_counter].area.setAttribute(
    "height",
    border_box_bottom[physics_counter].height
  );
  border_box_bottom[physics_counter].transform();
  border_box_bottom[physics_counter].physics_data = create_box(
    border_box_bottom[physics_counter].width,
    border_box_bottom[physics_counter].height,
    border_box_bottom[physics_counter].x,
    border_box_bottom[physics_counter].y,
    border_box_bottom[physics_counter].rotation,
    border_box_bottom[physics_counter].physics_type,
    border_box_bottom[physics_counter]
  );
  lever[physics_counter] = new MovieClip(
    document.getElementById("box").cloneNode(true)
  );
  lever[physics_counter].x = lever_x;
  lever[physics_counter].y = lever_y;
  lever[physics_counter].area =
    lever[physics_counter].instance.querySelector(".area");
  lever[physics_counter].width = 630;
  lever[physics_counter].height = 15;
  lever[physics_counter].rotation = 0;
  lever[physics_counter].physics_type = b2Body.b2_dynamicBody;
  lever[physics_counter].area.setAttribute(
    "x",
    (-1 * lever[physics_counter].width) / 2
  );
  lever[physics_counter].area.setAttribute(
    "y",
    (-1 * lever[physics_counter].height) / 2
  );
  lever[physics_counter].area.setAttribute(
    "width",
    lever[physics_counter].width
  );
  lever[physics_counter].area.setAttribute(
    "height",
    lever[physics_counter].height
  );
  lever[physics_counter].transform();
  stage.appendChild(lever[physics_counter].instance);
  lever[physics_counter].physics_data = create_box(
    lever[physics_counter].width,
    lever[physics_counter].height,
    lever[physics_counter].x,
    lever[physics_counter].y,
    lever[physics_counter].rotation,
    lever[physics_counter].physics_type,
    lever[physics_counter],
    1 / weight_divisor
  );
  fulcrum[physics_counter] = new MovieClip(
    document.getElementById("circle_src").cloneNode(true)
  );
  fulcrum[physics_counter].x = fulcrum_x;
  fulcrum[physics_counter].y = fulcrum_y;
  fulcrum[physics_counter].area =
    fulcrum[physics_counter].instance.querySelector(".area");
  fulcrum[physics_counter].radius = 0.001;
  fulcrum[physics_counter].physics_type = b2Body.b2_staticBody;
  fulcrum[physics_counter].transform();
  fulcrum[physics_counter].area.setAttribute("fill", "#C18816");
  fulcrum[physics_counter].area.setAttribute(
    "r",
    fulcrum[physics_counter].radius
  );
  fulcrum[physics_counter].physics_data = create_circle(
    fulcrum[physics_counter].radius,
    fulcrum[physics_counter].x,
    fulcrum[physics_counter].y,
    fulcrum[physics_counter].physics_type,
    fulcrum[physics_counter]
  );
  var fulcrum_joint_def = new b2RevoluteJointDef();
  fulcrum_joint_def.Initialize(
    lever[physics_counter].physics_data,
    fulcrum[physics_counter].physics_data,
    fulcrum[physics_counter].physics_data.GetWorldCenter()
  );
  fulcrum_joint[physics_counter] = new MovieClip(
    document.getElementById("box").cloneNode(true)
  );
  fulcrum_joint[physics_counter].physics_data =
    world.CreateJoint(fulcrum_joint_def);
  fulcrum_bar[physics_counter] = new MovieClip(
    document.getElementById("box").cloneNode(true)
  );
  fulcrum_bar[physics_counter].x = fulcrum_x;
  fulcrum_bar[physics_counter].y = fulcrum_y + 90;
  fulcrum_bar[physics_counter].area =
    fulcrum_bar[physics_counter].instance.querySelector(".area");
  fulcrum_bar[physics_counter].width = 64;
  fulcrum_bar[physics_counter].height = 50;
  fulcrum_bar[physics_counter].rotation = 0;
  fulcrum_bar[physics_counter].physics_type = b2Body.b2_staticBody;
  fulcrum_bar[physics_counter].area.setAttribute(
    "x",
    (-1 * fulcrum_bar[physics_counter].width) / 2
  );
  fulcrum_bar[physics_counter].area.setAttribute(
    "y",
    (-1 * fulcrum_bar[physics_counter].height) / 2
  );
  fulcrum_bar[physics_counter].area.setAttribute(
    "width",
    fulcrum_bar[physics_counter].width
  );
  fulcrum_bar[physics_counter].area.setAttribute(
    "height",
    fulcrum_bar[physics_counter].height
  );
  fulcrum_bar[physics_counter].transform();
  fulcrum_bar[physics_counter].physics_data = create_box(
    fulcrum_bar[physics_counter].width,
    fulcrum_bar[physics_counter].height,
    fulcrum_bar[physics_counter].x,
    fulcrum_bar[physics_counter].y,
    fulcrum_bar[physics_counter].rotation,
    fulcrum_bar[physics_counter].physics_type,
    fulcrum_bar[physics_counter]
  );
  box_left[physics_counter] = new MovieClip(
    document.getElementById("box_weight").cloneNode(true)
  );
  box_left[physics_counter].x = box_left_x;
  box_left[physics_counter].y = box_left_y;
  box_left[physics_counter].hitX = box_dimension / 2;
  box_left[physics_counter].hitY = (-1 * box_dimension) / 2;
  box_left[physics_counter].hitWidth = box_dimension;
  box_left[physics_counter].hitHeight = box_dimension * 2;
  box_left[physics_counter].width = box_dimension;
  box_left[physics_counter].height = box_dimension;
  box_left[physics_counter].rotation = 0;
  box_left[physics_counter].physics_type = b2Body.b2_dynamicBody;
  box_left[physics_counter].transform();
  stage.appendChild(box_left[physics_counter].instance);
  box_left[physics_counter].physics_data = create_box(
    box_left[physics_counter].width,
    box_left[physics_counter].height,
    box_left[physics_counter].x,
    box_left[physics_counter].y,
    box_left[physics_counter].rotation,
    box_left[physics_counter].physics_type,
    box_left[physics_counter],
    box_left_weight / weight_divisor
  );
  box_right[physics_counter] = new MovieClip(
    document.getElementById("box_weight").cloneNode(true)
  );
  box_right[physics_counter].x = box_right_x;
  box_right[physics_counter].y = box_right_y;
  box_right[physics_counter].hitX = box_dimension / 2;
  box_right[physics_counter].hitY = box_dimension / 2;
  box_right[physics_counter].hitWidth = box_dimension / 2;
  box_right[physics_counter].hitHeight = box_dimension / 2;
  box_right[physics_counter].width = box_dimension;
  box_right[physics_counter].height = box_dimension;
  box_right[physics_counter].rotation = 0;
  box_right[physics_counter].physics_type = b2Body.b2_dynamicBody;
  box_right[physics_counter].transform();
  stage.appendChild(box_right[physics_counter].instance);
  box_right[physics_counter].physics_data = create_box(
    box_right[physics_counter].width,
    box_right[physics_counter].height,
    box_right[physics_counter].x,
    box_right[physics_counter].y,
    box_right[physics_counter].rotation,
    box_right[physics_counter].physics_type,
    box_right[physics_counter],
    box_right_weight / weight_divisor
  );
  var box_left_weld_joint_def = new b2WeldJointDef();
  box_left_weld_joint_def.Initialize(
    lever[physics_counter].physics_data,
    box_left[physics_counter].physics_data,
    lever[physics_counter].physics_data.GetWorldCenter()
  );
  box_left_weld_joint[physics_counter] = new MovieClip(
    document.getElementById("box").cloneNode(true)
  );
  box_left_weld_joint[physics_counter].physics_data = world.CreateJoint(
    box_left_weld_joint_def
  );
  var box_right_weld_joint_def = new b2WeldJointDef();
  box_right_weld_joint_def.Initialize(
    lever[physics_counter].physics_data,
    box_right[physics_counter].physics_data,
    lever[physics_counter].physics_data.GetWorldCenter()
  );
  box_right_weld_joint[physics_counter] = new MovieClip(
    document.getElementById("box").cloneNode(true)
  );
  box_right_weld_joint[physics_counter].physics_data = world.CreateJoint(
    box_right_weld_joint_def
  );
  for (var i = 0; i < box_left_tiles.length; i++) {
    strip[box_left_tiles[i]].target_x = 0;
    strip[box_left_tiles[i]].target_y =
      i * -1 * strip_dimension + 0.5 * strip_dimension;
    strip[box_left_tiles[i]].tweenStart(
      300,
      strip[box_left_tiles[i]].target_x,
      strip[box_left_tiles[i]].target_y,
      "current",
      "current",
      "current"
    );
    box_left[physics_counter].instance.appendChild(
      strip[box_left_tiles[i]].instance
    );
  }
  for (var i = 0; i < box_right_tiles.length; i++) {
    strip[box_right_tiles[i]].target_x = 0;
    strip[box_right_tiles[i]].target_y =
      i * -1 * strip_dimension + 0.5 * strip_dimension;
    strip[box_right_tiles[i]].tweenStart(
      300,
      strip[box_right_tiles[i]].target_x,
      strip[box_right_tiles[i]].target_y,
      "current",
      "current",
      "current"
    );
    box_right[physics_counter].instance.appendChild(
      strip[box_right_tiles[i]].instance
    );
  }
}
function strip_remove(id, x, y) {
  sound_trash.play();
  strip[id].instance.setAttribute("display", "none");
  hit_effect.x = x;
  hit_effect.y = y;
  hit_effect.transform();
  hit_effect.playFrames(hit_effect.smoke);
}
function clear_activity() {
  fulcrum_x_holder = 390;
  box_left_weight_holder = 1;
  box_right_weight_holder = 1;
  for (var i = 0; i < box_left_tiles.length; i++) {
    box_left[physics_counter].instance.removeChild(
      strip[box_left_tiles[i]].instance
    );
  }
  for (var i = 0; i < box_right_tiles.length; i++) {
    box_right[physics_counter].instance.removeChild(
      strip[box_right_tiles[i]].instance
    );
  }
  box_left_tiles = new Array();
  box_right_tiles = new Array();
  strip_counter = 0;
  strip = new Array();
}
function clear_handler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    clear_activity();
    render_state = "create_world";
  }
}
function random_handler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    clear_activity();
    var left_total = generateRandom(1, 1);
    var right_total = generateRandom(1, 1);
    var holder;
    var type;
    holder = new Array();
    for (var i = 1; i <= left_total; i++) {
      type = generateRandom(1, 7);
      holder[i] = strip_item(type, 0, 0);
      holder[i].y = (i - 1) * strip_dimension * -1;
      box_left_weight_holder += Number(type);
      box_left_tiles.push(holder[i].id);
      box_left[physics_counter].instance.appendChild(
        strip[holder[i].id].instance
      );
    }
    holder = new Array();
    for (var i = 1; i <= right_total; i++) {
      type = generateRandom(1, 7);
      holder[i] = strip_item(type, 0, 0);
      holder[i].y = (i - 1) * strip_dimension * -1;
      box_right_weight_holder += Number(type);
      box_right_tiles.push(holder[i].id);
      box_right[physics_counter].instance.appendChild(
        strip[holder[i].id].instance
      );
    }
    render_state = "create_world";
  }
}
function update_timer_handler(timestamp) {
  if (render_state == "render_world") {
    world.Step(1 / 100, 100, 100);
    lever[physics_counter].x =
      lever[physics_counter].physics_data.GetPosition().x * world_scale;
    lever[physics_counter].y =
      lever[physics_counter].physics_data.GetPosition().y * world_scale;
    lever[physics_counter].rotation =
      lever[physics_counter].physics_data.GetAngle() * radians_to_degrees;
    lever[physics_counter].transform();
    box_left[physics_counter].x =
      box_left[physics_counter].physics_data.GetPosition().x * world_scale;
    box_left[physics_counter].y =
      box_left[physics_counter].physics_data.GetPosition().y * world_scale;
    box_left[physics_counter].rotation =
      box_left[physics_counter].physics_data.GetAngle() * radians_to_degrees;
    box_left[physics_counter].transform();
    box_right[physics_counter].x =
      box_right[physics_counter].physics_data.GetPosition().x * world_scale;
    box_right[physics_counter].y =
      box_right[physics_counter].physics_data.GetPosition().y * world_scale;
    box_right[physics_counter].rotation =
      box_right[physics_counter].physics_data.GetAngle() * radians_to_degrees;
    box_right[physics_counter].transform();
    world.ClearForces();
  } else if (render_state == "create_world") {
    remove_lever();
    create_lever(
      fulcrum_x_holder,
      box_left_weight_holder,
      box_right_weight_holder
    );
    if (drag_front) {
      drag_front = false;
      stage.appendChild(dragElement.instance);
    }
    render_state = "render_world";
  }
  requestAnimationFrame(update_timer_handler);
}
function center_handler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    fulcrum_x_holder = 390;
    render_state = "create_world";
  }
}
function button_fulcrum_handler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    render_state = "none";
    lever[physics_counter].x = lever_x;
    lever[physics_counter].y = lever_y;
    lever[physics_counter].rotation = 0;
    lever[physics_counter].transform();
    box_left[physics_counter].x = box_left_x;
    box_left[physics_counter].y = box_left_y;
    box_left[physics_counter].rotation = 0;
    box_left[physics_counter].transform();
    box_right[physics_counter].x = box_right_x;
    box_right[physics_counter].y = box_right_y;
    box_right[physics_counter].rotation = 0;
    box_right[physics_counter].transform();
    dragElement = button_fulcrum;
    dragPointerStart(event);
  }
}
function strip_handler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    if (!this.tweening) {
      var id = this.getAttribute("data-id");
      var box_left_index = box_left_tiles.indexOf(Number(id));
      var box_right_index = box_right_tiles.indexOf(Number(id));
      var side;
      if (box_left_index > -1) {
        side = "left";
        box_left_weight_holder -= Number(strip[id].type);
        box_left_tiles.splice(box_left_index, 1);
      } else {
        side = "right";
        box_right_weight_holder -= Number(strip[id].type);
        box_right_tiles.splice(box_right_index, 1);
      }
      dragElement = strip[id];
      if (side == "left") {
        dragElement.x += box_left[physics_counter].x;
        dragElement.y += box_left[physics_counter].y;
      } else {
        dragElement.x += box_right[physics_counter].x;
        dragElement.y += box_right[physics_counter].y;
      }
      dragElement.transform();
      dragPointerStart(event);
      drag_front = true;
      render_state = "create_world";
    }
  }
}
function menu_handler(event) {
  event.preventDefault();
  if (event.isPrimary) {
    if (!inital_sound) {
      inital_sound = true;
      sound_placement.play();
    }
    dragElement = strip_item(
      this.getAttribute("data-id"),
      menu[this.getAttribute("data-id")].x,
      menu[this.getAttribute("data-id")].y
    );
    dragPointerStart(event);
  }
}
function set_data() {
  color_data[1] = "#e2ca3f";
  color_data[2] = "#e2ca3f";
  color_data[3] = "#e2ca3f";
  color_data[4] = "#e2ca3f";
  color_data[5] = "#e2ca3f";
  color_data[6] = "#e2ca3f";
  color_data[7] = "#e2ca3f";
  color_data[8] = "#e2ca3f";
  color_data[9] = "#e2ca3f";
  color_data[10] = "#e2ca3f";
  color_data[11] = "#e2ca3f";
  color_data[12] = "#e2ca3f";
  color_data[13] = "#e2ca3f";
  color_data[14] = "#e2ca3f";
  color_data[15] = "#e2ca3f";
  color_data[16] = "#e2ca3f";
  color_data[17] = "#e2ca3f";
  color_data[18] = "#e2ca3f";
  b2Vec2 = Box2D.Common.Math.b2Vec2;
  b2AABB = Box2D.Collision.b2AABB;
  b2BodyDef = Box2D.Dynamics.b2BodyDef;
  b2Body = Box2D.Dynamics.b2Body;
  b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  b2Fixture = Box2D.Dynamics.b2Fixture;
  b2World = Box2D.Dynamics.b2World;
  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
  b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
  b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
  b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
  b2Listener = Box2D.Dynamics.b2ContactListener;
}
function addPointerListeners() {
  button_random.instance.addEventListener("pointerdown", random_handler, false);
  button_center.instance.addEventListener("pointerdown", center_handler, false);
  button_clear.instance.addEventListener("pointerdown", clear_handler, false);
  button_fulcrum.instance.addEventListener(
    "pointerdown",
    button_fulcrum_handler,
    false
  );
  for (var i = 1; i <= menu_total; i++) {
    menu[i].instance.addEventListener("pointerdown", menu_handler, false);
  }
}
function create_box(
  width,
  height,
  px,
  py,
  angle,
  type,
  movieclip,
  density = 1
) {
  var bodyDef = new b2BodyDef();
  bodyDef.type = type;
  bodyDef.position.Set(px / world_scale, py / world_scale);
  bodyDef.userData = movieclip;
  var polygonShape = new b2PolygonShape();
  polygonShape.SetAsOrientedBox(
    width / 2 / world_scale,
    height / 2 / world_scale,
    new b2Vec2(0, 0),
    (angle * Math.PI) / 180
  );
  var fixtureDef = new b2FixtureDef();
  fixtureDef.density = density;
  fixtureDef.friction = 1.0;
  fixtureDef.restitution = 0.0;
  fixtureDef.shape = polygonShape;
  var world_body = world.CreateBody(bodyDef);
  world_body.CreateFixture(fixtureDef);
  return world_body;
}
function create_circle(radius, pX, pY, type, movieclip) {
  var bodyDef = new b2BodyDef();
  bodyDef.type = type;
  bodyDef.position.Set(pX / world_scale, pY / world_scale);
  bodyDef.userData = movieclip;
  var fixtureDef = new b2FixtureDef();
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.1;
  fixtureDef.restitution = 0.0;
  fixtureDef.shape = new b2CircleShape(radius / world_scale);
  var world_body = world.CreateBody(bodyDef);
  world_body.CreateFixture(fixtureDef);
  return world_body;
}
