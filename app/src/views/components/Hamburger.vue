<template>
  <div :class="(expanded?'hexpanded ':'')+'burger'">
    <span></span>
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    expanded: Boolean
  }
}
</script>

<style lang="scss" scoped>
@function rem($size) {
  $remSize: $size / 16px;
  @return $remSize * 1rem;
}

// The mixin
@mixin menu(
  $width: 1.5rem,
  $height: rem(2),
  $gutter: rem(3),
  $color: white,
  $round: 0,
  $transition-duration: 0.3s
) {
  @if unit($width) == "px" {
    $width: rem($width);
  }
  @if unit($height) == "px" {
    $height: rem($height);
  }
  @if unit($gutter) == "px" {
    $gutter: rem($gutter);
  }

  // Set margins
  $margin: $height + $gutter;
  $margin-left: $width / 2;
  $margin-top: $height / 2;

  // Set specific styles for each bar
  $top: $height + $gutter;

  // set global Variables
  $menu-height: $height !global;
  $menu-gutter: $gutter !global;
  $menu-color: $color !global;
  $menu-margin: $margin !global;
  $menu-margin-left: $margin-left !global;
  $menu-margin-top: $margin-top !global;
  $menu-top: $top !global;

  // The code for the span
  user-select: none;
  position: absolute;
  text-indent: -999em;
  top: 50%;
  left: 50%;
  margin: -#{$menu-height/2} auto #{$margin-top};
  cursor: pointer;

  // Set styles to bars
  &,
  &:before,
  &:after {
    display: block;
    width: $width;
    height: $height;
    background-color: $color;
    transition: $transition-duration;
    opacity: 1;
    @if $round != 0 {
      border-radius: $round;
    }
  }
  // Bottom and top bar
  &:before,
  &:after {
    position: absolute;
    content: "";
  }

  // Top bar
  &:before {
    top: -#{$top};
  }

  // Bottom bar
  &:after {
    top: #{$top};
  }
}


@mixin menu-close-rotator {
  &:before,
  &:after {
    top: 0px;
    margin-top: -#{($menu-height/2) + ($menu-gutter + $menu-height)};
    @content;
  }
  & {
    transform: rotate(-360deg);
    background-color: transparent;
  }
  &:before {
    transform: translateY($menu-gutter + $menu-height) rotate(-45deg);
  }
  &:after {
    transform: translateY($menu-gutter + $menu-height) rotate(45deg);
  }
}

@mixin menu-body {
  &,
  &:before,
  &:after {
    @content;
  }
}

.burger {
  display: block;
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 3px;
  box-shadow: 0 0 grid(1) rgba(0, 0, 0, 0.25), 0 0 grid(0.2) rgba(0, 0, 0, 0.1);
  background-color: var(--color-white);

  span {
    @include menu(1.5rem, 0.125rem, 0.4rem);
  }
}

.burger.hexpanded {
  span {
    @include menu-close-rotator();
  }
}

</style>
