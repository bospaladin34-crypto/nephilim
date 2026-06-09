#include <jni.h>
#include <android/log.h>
#include <time.h>
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO,"nephilim",__VA_ARGS__)
extern "C" { void* nephilim_init(); void nephilim_braid(void*,const float*,float*); }
static void* M=nullptr;
extern "C" JNIEXPORT jboolean JNICALL Java_com_nephilim_core_NephilimJni_initEngine(JNIEnv*,jobject){ M=nephilim_init(); LOGI("Nephilim Core online — Φ=15.965Hz νp=0.17259029"); LOGI("Guardian Geometry loaded — 536 solutions"); return JNI_TRUE; }
extern "C" JNIEXPORT jfloatArray JNICALL Java_com_nephilim_core_NephilimJni_braid(JNIEnv* e,jobject,jfloatArray in){ jsize n=e->GetArrayLength(in); jfloat* ip=e->GetFloatArrayElements(in,nullptr); jfloatArray o=e->NewFloatArray(n); jfloat* op=e->GetFloatArrayElements(o,nullptr); nephilim_braid(M,ip,op); e->ReleaseFloatArrayElements(in,ip,0); e->ReleaseFloatArrayElements(o,op,0); return o; }
