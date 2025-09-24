package com.tradlibras.mobile.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class TranslateViewModel @Inject constructor(
): ViewModel() {
    private val _uiState = MutableStateFlow(TranslateUiState())
    val uiState: StateFlow<TranslateUiState> = _uiState

    fun updateInputText(text: String) {
        _uiState.value = _uiState.value.copy(inputText = text)
    }

    fun startRecording() {
        _uiState.value = _uiState.value.copy(isRecording = true)
        // Stub: simulate ASR after delay
        viewModelScope.launch {
            kotlinx.coroutines.delay(1500)
            _uiState.value = _uiState.value.copy(
                isRecording = false,
                inputText = "Olá, como você está?"
            )
        }
    }

    fun stopRecording() {
        _uiState.value = _uiState.value.copy(isRecording = false)
    }

    fun translate() {
        val text = _uiState.value.inputText
        if (text.isBlank()) return
        _uiState.value = _uiState.value.copy(isTranslating = true)
        viewModelScope.launch {
            try {
                // Stub API: produce fake result
                kotlinx.coroutines.delay(800)
                _uiState.value = _uiState.value.copy(
                    isTranslating = false,
                    translationResult = TranslationResult(signs = listOf(SignData(), SignData()), confidence = 0.95f)
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(isTranslating = false)
            }
        }
    }
}

data class TranslateUiState(
    val inputText: String = "",
    val isRecording: Boolean = false,
    val isTranslating: Boolean = false,
    val translationResult: TranslationResult? = null,
)

data class TranslationResult(
    val signs: List<SignData>,
    val confidence: Float,
)

class SignData