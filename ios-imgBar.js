class ImgBar extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	left: 0
	    };
	 }
	componentDidMount() {
		document.ontouchmove = function(ev){
			ev.preventDefault();
		 };
		let oDiv = this.refs.container,
			oUl = oDiv.querySelector("ul"),
			oLis = oUl.querySelectorAll("li"),
			len = oLis.length,
			liWidth =  oLis[0].offsetWidth;
		this.setState({
			oUl: oUl,
			oLis: oLis,
			len: len,
			current: 0,
			liWidth: oLis[0].offsetWidth,
			maxLeftGap: -liWidth * (len - 1),
			width: liWidth * len + "px"
		});
		oUl.style.width = liWidth * len + "px";
	}
	componentDidUpdate() {
		let {oUl, current, liWidth} = this.state;
		startMove(oUl,{left : -current * liWidth},400,'easeOut');
	}
	handleTouchStart(ev) {
		let touchs = ev.changedTouches[0],
			liLeft = this.state.oUl.offsetLeft;
		this.setState({
			touchX: touchs.pageX,
			touchTime: Date.now(),
			liLeft: liLeft,
	    	switchFlag: true
		});
	}
	handleTouchMove(ev) {
		let touchs = ev.changedTouches[0],
			{oUl,switchFlag, touchX, liLeft, maxLeftGap} = this.state,
			left = null;

		if(oUl.offsetLeft >= 0) {
			//从第二张灰滑到第一张时，touchX为在之前的值，
			//会产生跳跃的感觉，最后一张情况相同
			if(switchFlag) {
				switchFlag = false;
				touchX = touchs.pageX;
			}
			left = (touchs.pageX - touchX) / 3 + "px";
		}else if(oUl.offsetLeft <= maxLeftGap ) {
			if(switchFlag) {
				switchFlag = false;
				touchX = touchs.pageX;
			}
			left = (touchs.pageX - touchX) / 3 + maxLeftGap + "px";
		}else {
			left = touchs.pageX - touchX + liLeft + "px";
		}
		this.setState({
			switchFlag: switchFlag,
			left: left
		});
	}
	handleTouchEnd(ev) {
		let {touchX, liWidth, touchTime, current, len} = this.state,
			touchs = ev.changedTouches[0],
			gap = touchX - touchs.pageX;
		var flag = Math.abs(gap) > liWidth/2 ||
					Date.now() - touchTime < 300 &&
					Math.abs(gap) > 30;
		if(touchs.pageX < touchX) {//left
			if(current < len - 1 && flag){
				current++;
			}
		}else {
			if(current > 0 && flag){
				current--;
			}
		}
		this.setState({
			current: current
		});
	}
	render() {
		return (
			<div className="tabBar" ref="container">
				<ul onTouchStart={this.handleTouchStart.bind(this)}
					onTouchMove={this.handleTouchMove.bind(this)}
					onTouchEnd={this.handleTouchEnd.bind(this)}
					style={{left: this.state.left}}>
					{this.props.images.map((val, i)=>{
						return (
							<li key={i}>
								<img src={val} />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
ReactDOM.render(
	<ImgBar images={[
		"dist/img/1.jpg",
		"dist/img/2.jpg",
		"dist/img/3.jpg",
		"dist/img/4.jpg",
		"dist/img/5.jpg"
	]}/>,
	document.getElementById("example")
);