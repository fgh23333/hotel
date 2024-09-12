<template>
    <div id="imgUpload">
        <el-form ref="uploadForm" :model="form" label-width="80px" class="upload">
            <el-form-item label="文件名" @click="swiperCheck">
                <el-input v-model="form.generatedFilename" readonly placeholder="Generated filename will appear here" />
            </el-form-item>
            <el-form-item label="标题" @click="swiperCheck" v-if="form.section == 1">
                <el-input v-model="form.title" readonly placeholder="中部轮播图顶部标题（选填）" />
            </el-form-item>
            <el-form-item label="文件" @click="swiperCheck">
                <input type="file" @change="handleFileChange" ref="fileInput" class="fileInput" />
            </el-form-item>
            <el-form-item label="分区" @click="swiperCheck">
                <el-select v-model="form.section" placeholder="请选择轮播图区域" clearable>
                    <el-option label="顶部轮播图" value="0" />
                    <el-option label="中部轮播图" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item @click="swiperCheck">
                <el-button type="primary" @click="uploadFile">上传</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import axiosInstance from '@/utils/axiosInstance';

const emit = defineEmits(['addSwiperStatus'])

const bucket = 'bucket-1328716819'

const form = ref({
    generatedFilename: '',
    file: null,
    section: null,
    title: null
})

const fileInput = ref(null)

const props = defineProps({
    tableData: {
        type: Array,
        default: null
    },
    middleTableData: {
        type: Array,
        default: null
    }
})

const swiperCheck = () => {
    if (props.tableData.length > 5 || props.tableData.length == 5) {
        ElMessage({
            message: '顶部轮播图已满',
            type: 'info'
        })
    } else if (props.middleTableData.length > 5 || props.middleTableData.length == 5) {
        ElMessage({
            message: '中部轮播图已满',
            type: 'info'
        })
    }
}

const handleFileChange = (event) => {
    form.value.file = event.target.files[0]
    if (form.value.file) {
        generateUniqueFilename(form.value.file.name)
    }
}

const generateUniqueFilename = (originalName) => {
    const timestamp = Date.now()
    const extension = originalName.split('.').pop()
    const uniqueFilename = `file-${timestamp}.${extension}`
    form.value.generatedFilename = uniqueFilename
}

const uploadFile = async () => {
    if (!form.value.file || form.value.section == null) {
        ElMessage({
            message: '请完整填写表单',
            type: 'warning'
        })
        return
    }

    try {
        // 请求后端生成签名URL
        axiosInstance.post(`/api/uploadAuth/generateUploadUrl`, { key: form.value.generatedFilename })
            .then(response => {
                const uploadUrl = response.data.uploadUrl;

                // 上传文件到生成的签名URL
                axios.put(uploadUrl, form.value.file, {
                    headers: {
                        'Content-Type': form.value.file.type
                    }
                }).then(res => {
                    console.log('上传成功', res);
                    let storeForm = {
                        date: getCurrentTime(),
                        url: `https://${bucket}.cos.ap-shanghai.myqcloud.com/${form.value.generatedFilename}`,
                        seq: null,
                        section: form.value.section
                    }
                    if (storeForm.section == 0) {
                        storeForm.seq = props.tableData.length
                    } else {
                        storeForm.seq = props.middleTableData.length
                    }
                    axiosInstance.post(`/api/swiper`, storeForm).then(res => {
                        if (res.status == 200) {
                            ElMessage({
                                message: 'File uploaded successfully',
                                type: 'success'
                            })
                            emit('addSwiperStatus', true)
                            resetForm()
                        } else {
                            ElMessage({
                                message: '添加失败',
                                type: 'error'
                            })
                        }
                    })
                }).catch(err => {
                    console.error('上传失败', err);
                });
            }).catch(err => {
                console.error('获取签名URL失败', err);
            });
    } catch (error) {
        ElMessage({
            message: `Error: ${error.message}`,
            type: 'error'
        })
    }
}

const getCurrentTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDateTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return formattedDateTime
}

const resetForm = () => {
    form.value.generatedFilename = ''
    form.value.file = null
    form.value.section = null
    form.value.title = null
    fileInput.value.value = ''
}
</script>

<style scoped></style>