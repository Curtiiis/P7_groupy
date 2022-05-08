<template>
  <input type="file" :id="id" :name="name" :class="className" @change="onChange" :accept="accept" :capture="capture" />
</template>

<script>
import {mapState, mapGetters} from 'vuex';
import store from '../store/index';
import * as utils from '../js/utils';

export default {
  name: 'ImageResizer',
  props: {
    id: {
      type: String,
      default: 'media_file',
    },
    name: {
      type: String,
      default: 'media_file',
    },
    /**
     * An integer in pixels for the maximum width allowed for uploaded images, selected images with a greater width than this value will be scaled down before upload.
     * @default 102
     * @type {Number}
     */
    maxWidth: {
      type: Number,
      default: 102,
    },
    /**
     * An integer in pixels for the maximum height allowed for uploaded images, selected images with a greater height than this value will be scaled down before upload.
     * @default 102
     * @type {Number}
     */
    maxHeight: {
      type: Number,
      default: 102,
    },
    /**
     * A float between 0 and 1.00 for the image quality to use in the resulting image data, around 0.9 is recommended.
     * @default 1.00
     * @type {Number}
     */
    quality: {
      type: Number,
      default: 1.0,
    },
    /**
     * Sets the desired class name for the input element
     * @default {fileinput}
     * @type {String or Array}
     */
    className: {
      type: [String, Array],
      default: 'form-control-file',
    },
    /**
     * Sets an optional capture attribute. (false, camera, user, environment)
     * @default empty
     * @type [String or Boolean]
     */
    capture: {
      type: [String, Boolean],
      default: 'camera',
    },
    /**
     * Sets the accept attribute, in case the same input can accept other files
     * Shoub be a comma seperated string, eg 'audio/*,video/*,image/*'
     * @default image/*
     * @type {String}
     */
    accept: {
      type: String,
      default: 'image/*',
    },
    /**
     * An array of image's extensions that will not be resized (['gif', 'svg'])
     * If only 1 extension, it can be provided directly as a stringEg ('gif')
     * Disable all resizing with a catch all ('*')
     * If not resized, the returned output will always be the unmodifed File object
     * @default []
     * @type {String or Array}
     */
    doNotResize: {
      type: [String, Array],
      default: () => [],
    },
  },
  data() {
    return {
      currentFile: {},
      changeListenerEnabled: true,
    };
  },
  methods: {
    /**
     * Get file from input
     * @param  {object} event
     */
    onChange(e) {
      if (!this.changeListenerEnabled) {
        console.log('ignore onchange');
        return;
      }
      const file = e.target.files && e.target.files.length ? e.target.files[0] : null;
      if (file) {
        this.handleFile(e.target, file);
        document.querySelector('.publish-btn').disabled = false;
      }
    },
    /**
     * Handels the file manipulation on upload
     * @param  {File}     file The current original uploaded file
     */
    handleFile(fileInput, originalFile) {
      // console.log('handleFile() is called with file:', originalFile);
      if (!originalFile) {
        return;
      }

      const mimetype = originalFile.type.split('/');
      const isImage = originalFile.type.startsWith('image');
      const doNotResize = typeof this.doNotResize === 'string' ? [this.doNotResize] : this.doNotResize; // cast to array

      // Don't resize if not image or doNotResize is set
      if (!isImage || doNotResize.includes('*') || doNotResize.includes(mimetype[1])) {
        console.log('No Resize');
        return;
      }
      const that = this;
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const reader = new FileReader();
      var preview;
      if (this.createModale || this.updateModale) {
        preview = document.querySelector('#postImage');
        utils.commitImgPreview('-');
      } else {
        preview = document.querySelector('#preview-picture');
      }

      reader.onload = function (e) {
        img.src = e.target.result;
        preview.src = e.target.result;

        img.onload = function () {
          if (img.width < that.maxWidth && img.height < that.maxHeight) {
            // Resize not required
            utils.commitSelectedFile(originalFile);
            return;
          }
          const ratio = Math.min(that.maxWidth / img.width, that.maxHeight / img.height);
          const width = Math.round(img.width * ratio);
          const height = Math.round(img.height * ratio);
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            function (blob) {
              var resizedFile = new File([blob], 'resized_' + originalFile.name, originalFile);
              var dataTransfer = new DataTransfer();
              dataTransfer.items.add(resizedFile);

              store.commit('changeState', {
                selectedFile: dataTransfer.files[0],
              });
              // console.log('Resized file: ', dataTransfer.files[0]);
            },
            'image/jpeg',
            that.quality
          );
        };
      };
      reader.readAsDataURL(originalFile);
    },
  },
  computed: {
    ...mapState({
      selectedFile: 'selectedFile',
      showLoader: 'showLoader',
      createModale: 'createModale',
      imgPreview: 'imgPreview',
      updateModale: 'updateModale',
    }),
    ...mapGetters(['fileGetter', 'loaderGetter', 'createGetter', 'imgPreviewGetter', 'updateGetter']),
  },
};
</script>
