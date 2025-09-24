package com.tradlibras.mobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.tradlibras.mobile.presentation.screens.TranslateScreen
import com.tradlibras.mobile.presentation.screens.CameraScreen
import com.tradlibras.mobile.presentation.screens.SettingsScreen
import com.tradlibras.mobile.presentation.viewmodel.TranslateViewModel
import com.tradlibras.mobile.ui.theme.TradLibrasTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TradLibrasTheme {
                TradLibrasApp()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TradLibrasApp() {
    val navController = rememberNavController()
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("TradLibras") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    icon = { Text("🎤") },
                    label = { Text("Traduzir") },
                    selected = true,
                    onClick = { navController.navigate("translate") }
                )
                NavigationBarItem(
                    icon = { Text("📹") },
                    label = { Text("Câmera") },
                    selected = false,
                    onClick = { navController.navigate("camera") }
                )
                NavigationBarItem(
                    icon = { Text("⚙️") },
                    label = { Text("Config") },
                    selected = false,
                    onClick = { navController.navigate("settings") }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "translate",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("translate") {
                val viewModel: TranslateViewModel = hiltViewModel()
                TranslateScreen(viewModel = viewModel)
            }
            composable("camera") {
                CameraScreen()
            }
            composable("settings") {
                SettingsScreen()
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun TradLibrasAppPreview() {
    TradLibrasTheme {
        TradLibrasApp()
    }
}