<?php

namespace spec\AppBundle\Resolver;

use AppBundle\Entity\Computation;
use AppBundle\Provider\ComputationProvider;
use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

/**
 * Class ComputationResolverSpec
 * @package spec\AppBundle\Resolver
 */
class ComputationResolverSpec extends ObjectBehavior
{

    function let(
        ComputationProvider $computationProvider
    )
    {
        $this->beConstructedWith($computationProvider);
    }

    function it_is_initializable()
    {
        $this->shouldHaveType('AppBundle\Resolver\ComputationResolver');
    }

    function it_should_resolve_computation_from_json_object_and_ip_address(
        ComputationProvider $computationProvider,
        Computation $computation
    )
    {
        $computationProvider->createComputation()
            ->willReturn($computation)
        ;

        $computation->setScheme("PAILLER")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;
        $computation->setAEncrypted("123123")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;
        $computation->setBEncrypted("143454")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;
        $computation->setPublicKey([
            "a" => "123123"
        ])
            ->shouldBeCalled()
            ->willReturn($computation)
        ;
        $computation->setStages([
            [
                "name" => "Workspace",
                "steps" => [
                ]
            ]
        ])
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $computation->setIpAddress("127.0.0.1")
            ->shouldBeCalled()
            ->willReturn($computation)
        ;

        $jsonObj = [
            "scheme" => "PAILLER",
            "aEncrypted" => "123123",
            "bEncrypted" => "143454",
            "publicKey" => [
                "a" => "123123"
            ],
            "stages" => [
                [
                    "name" => "Workspace",
                    "steps" => [
                    ]
                ]
            ]
        ];
        $ipAddress = "127.0.0.1";

        $this->fromArrayAndIpAddress($jsonObj, $ipAddress)
            ->shouldReturnAnInstanceOf('AppBundle\Entity\Computation')
        ;
    }
}
