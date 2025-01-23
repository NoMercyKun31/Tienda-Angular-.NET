-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-01-2025 a las 18:45:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda_angular_dotnet_lunargames`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_videojuego` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id`, `id_usuario`, `id_videojuego`, `cantidad`, `fecha_agregado`) VALUES
(87, 1, 1, 1, '2025-01-22 19:03:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedido`
--

CREATE TABLE `detalles_pedido` (
  `id` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_videojuego` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_pedido`
--

INSERT INTO `detalles_pedido` (`id`, `id_pedido`, `id_videojuego`, `cantidad`, `precio_unitario`) VALUES
(25, 18, 3, 2, 29.99),
(26, 18, 2, 1, 15.49),
(27, 19, 3, 1, 29.99),
(28, 20, 1, 2, 5.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` text NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `numero_tarjeta` varchar(16) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL COMMENT 'IPv4 or IPv6 address',
  `user_agent` varchar(255) DEFAULT NULL COMMENT 'Browser User-Agent string'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `id_usuario`, `nombre`, `email`, `direccion`, `telefono`, `numero_tarjeta`, `total`, `estado`, `fecha_creacion`, `ip_address`, `user_agent`) VALUES
(18, 1, 'Carlos', 'carlos@example.com', 'Santa Ana', '600374168', '1234567890111213', 75.47, 'completado', '2025-01-21 14:41:03', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0'),
(19, 1, 'Juan Perez', 'juan.perez@example.com', 'Santa Ana', '600374168', '1234567890123456', 29.99, 'completado', '2025-01-21 15:36:34', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0'),
(20, 1, 'Carlos', 'carlos@example.com', 'Santa Ana', '600374168', '1234567890123456', 11.98, 'cancelado', '2025-01-22 17:28:47', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videojuegos_retro`
--

CREATE TABLE `videojuegos_retro` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` enum('En Oferta','Destacado','Nuevo Lanzamiento') NOT NULL,
  `compania` varchar(255) NOT NULL,
  `anio_lanzamiento` int(11) NOT NULL,
  `categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videojuegos_retro`
--

INSERT INTO `videojuegos_retro` (`id`, `titulo`, `precio`, `estado`, `compania`, `anio_lanzamiento`, `categoria`) VALUES
(1, 'Super Mario Bros.', 5.99, 'Destacado', 'Nintendo', 1985, 'Plataformas'),
(2, 'Sonic the Hedgehog', 15.49, 'Destacado', 'Sega', 1991, 'Plataformas'),
(3, 'The Legend of Zelda', 29.99, 'En Oferta', 'Nintendo', 1986, 'Aventura'),
(4, 'Pac-Man 2', 11.99, 'Destacado', 'Namco', 1980, 'Arcade'),
(5, 'Street Fighter II', 24.99, 'En Oferta', 'Capcom', 1991, 'Lucha'),
(6, 'Donkey Kong', 16.99, 'Destacado', 'Nintendo', 1981, 'Arcade'),
(7, 'Chrono Trigger', 39.99, 'Destacado', 'Square', 1995, 'RPG'),
(8, 'Final Fantasy VII', 44.99, 'Destacado', 'Square Enix', 1997, 'RPG'),
(9, 'Metal Gear Solid', 34.99, 'En Oferta', 'Konami', 1998, 'Acción/Aventura'),
(10, 'Mega Man X', 29.99, 'En Oferta', 'Capcom', 1993, 'Plataformas/Acción'),
(11, 'Castlevania: Symphony of the Night', 49.99, 'Nuevo Lanzamiento', 'Konami', 1997, 'Aventura/Plataformas'),
(12, 'Contra', 19.99, 'Destacado', 'Konami', 1987, 'Acción'),
(13, 'Shovel Knight 2', 34.99, 'Nuevo Lanzamiento', 'Yacht Club Games', 2014, 'Plataformas'),
(14, 'Cuphead', 39.99, 'Nuevo Lanzamiento', 'Studio MDHR', 2017, 'Acción/Plataformas'),
(15, 'Streets of Rage 4', 29.99, 'En Oferta', 'Dotemu', 2020, 'Beat \'em up'),
(16, 'Celeste', 19.99, 'En Oferta', 'Maddy Makes Games', 2018, 'Plataformas'),
(17, 'Hollow Knight', 24.99, 'En Oferta', 'Team Cherry', 2017, 'Metroidvania'),
(18, 'Axiom Verge', 29.99, 'Destacado', 'Thomas Happ Games', 2015, 'Metroidvania'),
(51, 'Portal 3', 15.99, 'Destacado', 'Nintendo', 2011, 'Aventura');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_videojuego` (`id_videojuego`);

--
-- Indices de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_videojuego` (`id_videojuego`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `videojuegos_retro`
--
ALTER TABLE `videojuegos_retro`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `videojuegos_retro`
--
ALTER TABLE `videojuegos_retro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_videojuego`) REFERENCES `videojuegos_retro` (`id`);

--
-- Filtros para la tabla `detalles_pedido`
--
ALTER TABLE `detalles_pedido`
  ADD CONSTRAINT `detalles_pedido_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `detalles_pedido_ibfk_2` FOREIGN KEY (`id_videojuego`) REFERENCES `videojuegos_retro` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
