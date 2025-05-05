import { Flex, Text, Spinner, Box } from "@radix-ui/themes";
import { Dna } from "lucide-react"

export default function LoadingScreen() {
    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            height="100vh"
            gap="4"
            style={{
                padding: '2rem',
                textAlign: 'center',
            }}
        >
            <Dna color="var(--accent-9)" size={100} />

            <Text size="7" weight="bold">
                Genetic Circuit Simulator
            </Text>

            <Text size="4" color="gray">
                Starting app...
            </Text>

            <Text size="2" color="gray">
                Please wait while the simulator initializes.
            </Text>

            <Spinner size="3" mt="4" />
        </Flex>
    );
}
