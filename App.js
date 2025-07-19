import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  Image, 
  StyleSheet, 
  Platform 
} from 'react-native';

const WeatherApp = () => {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async () => {
    if (!cityName.trim()) {
      setWeatherData(null);
      setAlertMessage('Você precisa digitar uma cidade para assim receber os dados meteorológicos');
      return;
    }

    const apiKey = '8e310cdc1c7acec9e4bede0324722901';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityName.trim()
    )}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const results = await fetch(apiUrl);
      const json = await results.json();

      if (json.cod === 200) {
        const data = {
          city: json.name,
          country: json.sys.country,
          temp: json.main.temp,
          tempMax: json.main.temp_max,
          tempMin: json.main.temp_min,
          description: json.weather[0].description,
          tempIcon: json.weather[0].icon,
          windSpeed: json.wind.speed,
          humidity: json.main.humidity,
        };
        setWeatherData(data);
        setAlertMessage('');
      } else {
        setWeatherData(null);
        setAlertMessage("Erro ao efetuar a busca, por favor tente novamente");
      }
    } catch (error) {
      setWeatherData(null);
      setAlertMessage('Erro ao buscar os dados');
    }
  };

  const handleKeyPress = (event) => {
    if (Platform.OS === 'web' && event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="Buscar cidade"
          placeholderTextColor="#666"
          value={cityName}
          onChangeText={setCityName}
          onSubmitEditing={handleSubmit}
          onKeyPress={handleKeyPress}
          returnKeyType="search"
        />
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={styles.button}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {weatherData && (
        <View style={styles.weather}>
          <Text style={styles.title}>{`${weatherData.city}, ${weatherData.country}`}</Text>
          
          <View style={styles.infos}>
            <View style={styles.temp}>
              <Image
                style={styles.temp_img}
                source={{uri: `https://openweathermap.org/img/wn/${weatherData.tempIcon}@2x.png`}}
                resizeMode="contain"
              />
              <View style={styles.tempInfo}>
                <Text style={styles.temp_value}>
                  {`${weatherData.temp.toFixed(1).toString().replace('.', ',')} `}
                  <Text style={styles.sup}>°C</Text>
                </Text>
                <Text style={styles.temp_description}>{weatherData.description}</Text>
              </View>
            </View>
            
            <View style={styles.other_infos}>
              <View style={styles.info}>
                <Text style={styles.icon}>🔥</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.info_title}>Temp. max</Text>
                  <Text style={styles.temp_max}>
                    {`${weatherData.tempMax.toFixed(1).toString().replace('.', ',')} `}
                    <Text style={styles.sup}>°C</Text>
                  </Text>
                </View>
              </View>
              
              <View style={styles.info}>
                <Text style={styles.icon}>❄️</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.info_title}>Temp. min</Text>
                  <Text style={styles.temp_min}>
                    {`${weatherData.tempMin.toFixed(1).toString().replace('.', ',')} `}
                    <Text style={styles.sup}>°C</Text>
                  </Text>
                </View>
              </View>
              
              <View style={styles.info}>
                <Text style={styles.icon}>💧</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.info_title}>Umidade</Text>
                  <Text style={styles.humidity}>{`${weatherData.humidity}%`}</Text>
                </View>
              </View>
              
              <View style={styles.info}>
                <Text style={styles.icon}>💨</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.info_title}>Vento</Text>
                  <Text style={styles.wind}>{`${weatherData.windSpeed.toFixed(1)} km/h`}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
      
      {alertMessage ? <Text style={styles.alert}>{alertMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f8ff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    ...Platform.select({
      web: {
        width: '100%',
        maxWidth: 500,
        margin: 'auto',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      },
      default: {
        flex: 1,
      }
    }),
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        '&:focus-within': {
          borderColor: '#5a7cdc',
          boxShadow: '0 0 0 2px rgba(90, 124, 220, 0.2)',
        }
      }
    })
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 4,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      }
    })
  },
  button: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#f0f0f0',
        }
      }
    })
  },
  buttonText: {
    fontSize: 18,
    ...Platform.select({
      web: {
        userSelect: 'none',
      }
    })
  },
  weather: {
    marginTop: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
    color: '#372f3f',
    fontSize: 24,
  },
  infos: {
    marginTop: 10,
  },
  temp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#5a7cdc',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #5a7cdc, #606dde)',
      }
    })
  },
  tempInfo: {
    alignItems: 'center',
  },
  temp_img: {
    width: 80,
    height: 80,
  },
  temp_value: {
    fontWeight: 'bold',
    fontSize: 50,
    lineHeight: 55,
    color: '#fff',
    textAlign: 'center',
  },
  temp_description: {
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  other_infos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: '48%',
    minWidth: 120,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }
      }
    })
  },
  infoContent: {
    flex: 1,
    marginLeft: 8,
  },
  info_title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  icon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  temp_max: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
  },
  temp_min: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  humidity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#50c8ff',
  },
  wind: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#95a5a6',
  },
  sup: {
    fontSize: 12,
    ...Platform.select({
      web: {
        verticalAlign: 'super',
      }
    })
  },
  alert: {
    color: '#e74c3c',
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: '#ffeaea',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccb',
  },
});

export default WeatherApp;