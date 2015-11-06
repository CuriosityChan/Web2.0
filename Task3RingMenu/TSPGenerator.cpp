#include <iostream>
#include <cstring>
#include <stdlib.h>
#include <time.h>

#define NUM_OF_CITY 20
#define NUM_OF_ROAD 20
using namespace std;

int roads[NUM_OF_CITY][NUM_OF_CITY];

void TSPGenerator() {
	srand((unsigned)time(NULL));
	menset(roads, 1000000, sizeof(roads));
	for (int i = 0; i < NUM_OF_ROAD; ++i)
	{
		int s, e;
		do {
			s = rand()%20;
			e = rand()%20;
		} while(s==e || roads[s][e]!=1000000);
		roads[s][e] = rand()%200+50;
	}
}

int main() {
	srand((unsigned)time(NULL));
	TSPGenerator();
	for (int i = 0; i < NUM_OF_CITY; ++i)
	{
		for (int j = 0; j < NUM_OF_CITY; ++j) {
			printf("%7d\t", roads[i][j]);
		}
		printf("\n");
	}
	int start = rand()%20;
	printf("Start from %d:\n", start);


}