import React from 'react';
import { Modal, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import styles from './styles.module.less';
import { cropConfig } from '../../constants/profile';


class ProfileAccountImageCropper extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        scale: 1.2,
        rotate: 0,
        allowZoomOut: false,
        borderRadius: 0,
        position: { x: 0.5, y: 0.5 },
        preview: null,
        width: 250,
        height: 250
    };
  }

  reset = () => {
    this.setState({
      crop: { ...cropConfig },
      base64Img: '',
      croppedImageUrl: ''
    });
  }
  handleScale = e => {
    const scale = parseFloat(e.target.value);

    this.setState({ scale });
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
  render () {
    const { avatar, visible, handleCancel, handleOk, formatMessage } = this.props;
    const { base64Img, rotate, croppedImageUrl, scale, height, width, allowZoomOut } = this.state;

    return (
      <Modal
        closable={false}
        className="wrapperModal"
        title={formatMessage({id: 'ProfileAccountImageCropper.cropHeader'})}
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
        <div className={`${styles.cropWrapper} profile-cropper`}>
            <AvatarEditor
                ref={this.setEditorRef}
                image={avatar}
                width={width}
                height={height}
                borderRadius={150}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                onLoadSuccess={this.onLoadSuccess}
                onImageChange={this.onImageChange}
                rotate={rotate}
            />
        </div>
        <div className={styles.croppedImageRotate}>
          <Button onClick={this.rotateLeft}><Icon type="redo" rotate={90} /></Button>
          <Button onClick={this.rotateRight}><Icon type="redo" rotate={-90} /></Button>
          <div>
            <span>{formatMessage({id: 'ProfileAccountImageCropper.Zoom'})}:</span>
            <input
              name="scale"
              type="range"
              onChange={this.handleScale}
              min={allowZoomOut ? '0.1' : '1'}
              max="2"
              step="0.01"
              defaultValue="1"
            />
          </div>
        </div>
        {croppedImageUrl && (
          <div className={styles.croppedImageContainer}>
            <img
              alt={formatMessage({id: 'ProfileAccountImageCropper.cropAlt'})}
              style={{ maxWidth: '100%' }}
              src={croppedImageUrl}
            />
          </div>
        )}
      </Modal>
    );
  }
}

ProfileAccountImageCropper.propTypes = {
  visible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  account: PropTypes.object
};
ProfileAccountImageCropper.defaultProps = {
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
export default ProfileAccountImageCropper;
