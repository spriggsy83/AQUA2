import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

class SubseqSlider extends Component {
	render() {
		const { subseqStart, subseqEnd, seqLength } = this.props;
		return (
			<div style={{ width: 300, margin: 50 }}>
				<Range
					min={1}
					max={seqLength}
					marks={{
						1: 1,
						[seqLength]: seqLength.toLocaleString()
					}}
					defaultValue={[subseqStart, subseqEnd]}
				/>
			</div>
		);
	}
}

SubseqSlider.propTypes = {
	subseqStart: PropTypes.number.isRequired,
	subseqEnd: PropTypes.number.isRequired,
	seqLength: PropTypes.number.isRequired
};

export default SubseqSlider;
