<?php
#[Attribute]
class Route {
    function __construct(
        public string $path
    ) {}
}