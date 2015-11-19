## 缘由 ##
开始接触移动端的开发，想通过实现ios系统常见的效果来熟悉移动端的touch事件。
## 实现方式 ##
实现这个效果时，我分别使用了两种方法：原生JavaScript和目前大热的React来实现。
### 原生JS ###
其实这个移动端效果和之前做的PC端的效果大体类似，只是没有PC端的onclick、onmousedown、onmousemove和onmouseup，取而代之的是ontouchstart、ontouchmove和ontouchend事件。在处理逻辑上和之前并没有太大的区别，想对的添加了比如首尾图片处的回弹的效果。此版本的实现更多的是对以前的一个回顾。
### React ###
React这个目前大火的库就不做介绍了，这里使用ES6语法来完成组件的编写。确实感觉到React在组件封装上的优势，因是刚开始接触所以还不能很好的使用它。

目前ImgBar至接受一个参数，那便是展示图片的传入，

    <ImgBar images={[
		"dist/img/1.jpg",
		"dist/img/2.jpg",
		"dist/img/3.jpg",
		"dist/img/4.jpg",
		"dist/img/5.jpg"
	]}/>

要从上面的React组件解析为HTML代码，并完成对应的效果，经历了以下几步：


完成state的初始化设置，在ES6的写法中，state的初始化写法已经变更为：

	constructor(props) {
	    super(props);
	    this.state = {
	    	left: 0
	    };
	 }
接着在render方法中完成显示内容的解析和时间的绑定：

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
这也就是整个组件的HTML结构，而在在实现滑动效果时，主要改变的是
**ul**标签的
**left**值，所以在每次setState时都需要更新left值去做重新的绘制。

接下来在React将组件绘制到DOM结构上去后，立马完成一些必要的初始化工作：

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
到此为止，便完成了组件一些必要的准备工作，当用户触发了touch事件后，便会调用对应事件方法里面的交互逻辑，当state有改变要反映到显示效果上时，便需要通过
**setState**
来触发React的重绘逻辑：

    this.setState({
		switchFlag: switchFlag,
		left: left
	});
这里有一点需要特别注意，我在开发时遇到了动画刷新失效的问题，因为我在React尚未完成更新时便就开始对其进行下一步的处理，导致方法运行不如预期，当时处理如下：

    componentWillUpdate() {
		let {oUl, current, liWidth} = this.state;
		startMove(oUl,{left : -current * liWidth},400,'easeOut');
	}
而这带来的就是运行效果混乱。正确的做法是React在完成状态更新和HTML DOM更新之后，再去对HTML节点进行动画效果过度，这点之前一直没理解清楚！

自此整个组件已经能够合理运行了，最后还需要做一些收尾的工作：

    componentWillUnmout() {
		document.ontouchmove = null;
	}
当组件解除挂载之后，需要做一些善后处理的工作。
## 总结 ##
以上就是我ios-imgBar组件的第一期制作工作，在这里做了一些经验总结。
## TODOList ##
对写法和代码进行优化，添加照片页的导航指示效果。