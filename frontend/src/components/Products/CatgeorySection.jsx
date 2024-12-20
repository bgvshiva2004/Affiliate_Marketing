'use client'

import { useRef, useEffect } from "react"
import Image from "next/image"
import ProductCard from './ProductCard'

export function CategorySection({ id, name, products }) {

	useEffect(() => {
		const slider = document.querySelector(`.items${id}`);
		let isDown = false;
		let startX;
		let scrollLeft;

		// Mouse events
		const mouseDown = (e) => {
			isDown = true;
			slider.classList.add('active');
			startX = e.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
		};
		const mouseLeave = () => {
			isDown = false;
			slider.classList.remove('active');
		};
		const mouseUp = () => {
			isDown = false;
			slider.classList.remove('active');
		};
		const mouseMove = (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - slider.offsetLeft;
			const walk = (x - startX) * 1;
			slider.scrollLeft = scrollLeft - walk;
			console.log(walk);
		};

		// Touch events
		const touchStart = (e) => {
			isDown = true;
			slider.classList.add('active');
			const touch = e.touches[0];
			startX = touch.pageX - slider.offsetLeft;
			scrollLeft = slider.scrollLeft;
		};
		const touchEnd = () => {
			isDown = false;
			slider.classList.remove('active');
		};
		const touchMove = (e) => {
			if (!isDown) return;
			e.preventDefault();
			const touch = e.touches[0];
			const x = touch.pageX - slider.offsetLeft;
			const walk = (x - startX) * 1;
			slider.scrollLeft = scrollLeft - walk;
			console.log(walk);
		};

		// Add event listeners for mouse and touch events
		slider.addEventListener('mousedown', mouseDown);
		slider.addEventListener('mouseleave', mouseLeave);
		slider.addEventListener('mouseup', mouseUp);
		slider.addEventListener('mousemove', mouseMove);

		slider.addEventListener('touchstart', touchStart);
		slider.addEventListener('touchend', touchEnd);
		slider.addEventListener('touchmove', touchMove);

		// Cleanup event listeners
		return () => {
			slider.removeEventListener('mousedown', mouseDown);
			slider.removeEventListener('mouseleave', mouseLeave);
			slider.removeEventListener('mouseup', mouseUp);
			slider.removeEventListener('mousemove', mouseMove);

			slider.removeEventListener('touchstart', touchStart);
			slider.removeEventListener('touchend', touchEnd);
			slider.removeEventListener('touchmove', touchMove);
		};
	}, [id]);

	return (
		<div className="">
			<h1 className="m-2 text-xl font-bold">{name}</h1>
			<div className="grid-container">
				
				<main className="grid-item main">
					<div className={`items${id} items`}>
						{products.map((product) => (
							<div
								key={product.id}
								className={`item mx-2`}
							>
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</main>
			</div>
			{/* <h2 className="section-title">{name}</h2>
      <div
        className="items-container items"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`item item${product.id}`}
          >
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={256}
              height={160}
              className="item-image"
            />
            <div className="item-details">
              <h3 className="item-title">{product.title}</h3>
              <p className="item-company">{product.companyName}</p>
              <p className="item-platform">{product.platform}</p>
              <p className="item-price">${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div> */}

<style jsx>{`
				.items${id} {
					overflow-x: hidden; /* Hide horizontal scrollbar */
				}

				.grid-container {
					overflow-x: hidden; /* Ensure the entire container hides horizontal scroll */
				}

				/* Optionally, you can hide scrollbars globally or on specific containers */
				* {
					scrollbar-width: none;  /* Firefox */
					-ms-overflow-style: none; /* Internet Explorer 10+ */
				}

				*::-webkit-scrollbar {
					display: none; /* Hide scrollbar for Webkit-based browsers */
				}
			`}</style>
		</div>
	)
}
