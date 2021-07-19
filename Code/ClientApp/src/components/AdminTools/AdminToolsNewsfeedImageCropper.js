import React from 'react';
import { Modal, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import styles from './styles.module.less';

class AdminToolsNewsfeedImageCropper extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
			scale: 1.2,
			rotate: 0,
			allowZoomOut: false,
			borderRadius: 0,
			position: { x: 0.5, y: 0.5 },
			preview: null,
			width: 1440,
			height: 900
    };
  }

  reset = () => {
		this.setState({
      base64Img: '',
      croppedImageUrl: ''
    });
	}
  rotateLeft = e => {
    e.preventDefault();
    this.setState({
      rotate: this.state.rotate - 90
    });
  }
  rotateRight = e => {
      e.preventDefault();
      this.setState({
          rotate: this.state.rotate + 90
      });
  }
	setEditorRef = editor => {
		if (editor) this.editor = editor;
	};
	onLoadSuccess = info => {
		this.rotateImage();
  }

	rotateImage () {
    const img = this.editor.getImageScaledToCanvas().toDataURL();

		this.setState({ croppedImageUrl: img, base64Img: img });
	}
	onImageChange = () => {
		this.rotateImage();
	}

  componentDidMount () {
    this.scaleSize();
  }
  scaleSize () {
    const {avatar} = this.props;
    const img = new Image();

    img.src = avatar;
    img.onload = () => {
      if (img.width === 1440 && img.height === 900) {
        this.setState({scale: 1});
      }
    };
  }
  render () {
    const { avatar, visible, handleCancel, handleOk, formatMessage } = this.props;
    const { base64Img, rotate, croppedImageUrl, scale, height, width, borderRadius } = this.state;

    return (
      <Modal
        width={600}
        closable={false}
        className="wrapperModal"
        title={formatMessage({id: 'AdminToolsNewsfeedImageCropper.cropHeader'})}
        visible={visible}
        onOk={() => {
          handleOk(base64Img);
          this.reset();
        }}
        onCancel={() => {
          handleCancel();
          this.reset();
        }}
      >
        <div className={`${styles.cropWrapper} adminToolCropper`}>
					<AvatarEditor
						ref={this.setEditorRef}
						image={avatar}
						width={width}
						height={height}
						color={[255, 255, 255, 0.6]} // RGBA
						scale={scale}
						border={50}
						borderRadius={borderRadius}
						onLoadSuccess={this.onLoadSuccess}
						onImageChange={this.onImageChange}
            rotate={rotate}
            style={{
              width: '100%',
              height: 'auto'
            }}
					/>
        </div>
				<div className={styles.croppedImageRotate}>
        <Button onClick={this.rotateLeft}><Icon type="redo" rotate={90} /></Button>
          <Button onClick={this.rotateRight}><Icon type="redo" rotate={-90} /></Button>
        </div>
        {croppedImageUrl && (
          <div className={styles.croppedImageContainer}>
            <img
              alt={formatMessage({id: 'AdminToolsNewsfeedImageCropper.cropAlt'})}
              style={{ maxWidth: '100%' }}
              src={croppedImageUrl}
            />
          </div>
        )}
      </Modal>
    );
  }
}

AdminToolsNewsfeedImageCropper.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  account: PropTypes.object
};
AdminToolsNewsfeedImageCropper.defaultProps = {
  visible: false,
  handleCancel: () => true,
  handleOk: () => true,
  account: {
    firstName: '',
    lastname: '',
    email: '',
    avatar: ''
  }
};
export default AdminToolsNewsfeedImageCropper;
