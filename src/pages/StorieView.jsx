import React, { useState } from 'react'

const stories = [
	{
		id: 1,
		user: "nico",
		time: "2 h",
		img: "https://picsum.photos/400/700?random=1",
		avatar: "https://i.pravatar.cc/100?img=1",
	},
	{
		id: 2,
		user: "vale",
		time: "5 h",
		img: "https://picsum.photos/400/700?random=2",
		avatar: "https://i.pravatar.cc/100?img=2",
	},
	{
		id: 3,
		user: "juan",
		time: "8 h",
		img: "https://picsum.photos/400/700?random=3",
		avatar: "https://i.pravatar.cc/100?img=3",
	},
	{
		id: 4,
		user: "camila",
		time: "10 h",
		img: "https://picsum.photos/400/700?random=4",
		avatar: "https://i.pravatar.cc/100?img=4",
	},
	{
		id: 5,
		user: "diego",
		time: "15 h",
		img: "https://picsum.photos/400/700?random=5",
		avatar: "https://i.pravatar.cc/100?img=5",
	},
];

export const StorieView = () => {

	const [current, setCurrent] = useState(2);

	const prevStory = () => {
		if (current > 0) {
			setCurrent(current - 1);
		}
	}

	const nextStory = () => {
		if (current < stories.length - 1) {
			setCurrent(current + 1);
		}
	}

	return (
		<>
			<div className='story-page bg-dark min-vh-100 position-relative overflow-hidden text-white'>
				<div className="position-absolute top-0 start-0 p-4 z-3">
					<h3 className="m-0">Instagram</h3>
				</div>

				<button className="story-close-btn position-absolute top-0 end-0 p-3 z-3">
					×
				</button>

				<div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
					className="story-arrow-btn"
					onClick={prevStory}
					disabled={current === 0}
            >
					❮
				</div>

				{/* card principal */}
				<div className="story-main-card position-relative overflow-hidden bg-black">

					{/* progreso */}
					<div className="position-absolute top-0 start-0 w-100 p-3 z-2">
						<div className="story-progress-bar">
							<div className="story-progress-fill"></div>
						</div>
					</div>

					{/* usuario */}
					<div className="position-absolute top-0 start-0 d-flex align-items-center gap-2 p-3 mt-3 z-2">
						<img
							src={stories[current].avatar}
							alt="avatar"
							className="story-avatar"
						/>

						<div>
							<h6 className="m-0 small fw-bold">
								{stories[current].user}
							</h6>

							<span className="small text-light opacity-75">
								{stories[current].time}
							</span>
						</div>
					</div>

					{/* imagen */}
					<img
						src={stories[current].img}
						alt="story"
						className="w-100 h-100 object-fit-cover"
					/>

				</div>

				{/* flecha derecha */}
				<button
					className="story-arrow-btn"
					onClick={nextStory}
					disabled={current === stories.length - 1}
				>
					❯
				</button>
				<div className="d-none d-xl-flex justify-content-center story-preview-side">
					{stories[current + 1] && (
						<div className="story-preview-card">
							<img
								src={stories[current + 1].img}
								alt="preview"
								className="w-100 h-100 object-fit-cover"
							/>
						</div>
					)}
				</div>

			</div>
		</>
	)
}